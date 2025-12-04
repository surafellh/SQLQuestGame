

import { GoogleGenAI, Type } from "@google/genai";
import { Challenge, Dataset, QueryResult, Difficulty } from "../types";

// In a real production app, we would use Supabase Edge Functions to call BigQuery.
// Here, we simulate BigQuery's behavior using Gemini to allow the user to run SQL 
// against "real" public dataset schemas without needing a personal GCP Service Account.

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// BUSINESS SCENARIOS FOR PROCEDURAL GENERATION
// This ensures the AI doesn't just ask "Select *", but roleplays real business needs.
const SCENARIOS = [
    "Fraud Detection Specialist",
    "Marketing Analytics Manager",
    "Product Growth Lead",
    "Financial Auditor",
    "Data Quality Engineer",
    "Customer Success Ops",
    "Supply Chain Logistican",
    "Compliance Officer"
];

export const generateChallenge = async (dataset: Dataset, difficulty: Difficulty): Promise<Challenge> => {
  const ai = getAiClient();
  const schemaDescription = dataset.tables.map(t => 
    `Table: ${t.name}\nColumns: ${t.columns.map(c => `${c.name} (${c.type})`).join(', ')}`
  ).join('\n\n');

  // Select a random business scenario to drive diversity
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

  let difficultyConstraints = "";
  if (difficulty === 'Beginner') {
    difficultyConstraints = `
      STRICT CONSTRAINT: BEGINNER LEVEL ONLY.
      - ABSOLUTELY NO JOINs.
      - ABSOLUTELY NO GROUP BY or AGGREGATE FUNCTIONS (COUNT, SUM, AVG).
      - ABSOLUTELY NO SUBQUERIES.
      - Task MUST be solvable with: SELECT [columns] FROM [table] WHERE [simple_condition] ORDER BY [column] LIMIT [n].
      - Keep logic very simple: "Find trips where fare is > 50" or "List users from Canada".
    `;
  } else if (difficulty === 'Intermediate') {
    difficultyConstraints = `
      STRICT CONSTRAINT: INTERMEDIATE LEVEL.
      - MUST use basic Aggregation (COUNT, SUM, AVG, MIN, MAX) with GROUP BY.
      - OR use INNER/LEFT JOIN between two tables.
      - Goal: Reporting and summarization.
    `;
  } else {
    difficultyConstraints = `
      STRICT CONSTRAINT: ADVANCED LEVEL.
      - MUST use Window Functions (ROW_NUMBER, LEAD, LAG) OR CTEs (WITH clause).
      - OR use Complex Multi-Joins (3+ tables).
      - OR use Subqueries in WHERE or HAVING.
      - Goal: Complex analytical reasoning or cleaning.
    `;
  }

  const prompt = `
    You are a Senior SQL Instructor acting as a ${scenario}.
    Your goal is to create a realistic business challenge for a junior analyst using the provided dataset.

    Dataset: ${dataset.name}
    Difficulty: ${difficulty}
    
    ${difficultyConstraints}

    Schema:
    ${schemaDescription}

    Create a unique SQL challenge. 
    1. The 'title' should be catchy and related to the scenario (e.g. "Suspicious Fares", "Viral Post Analysis").
    2. The 'description' should be a clear business question requesting data. Do not just say "Select X", say "The marketing team needs..." or "We found a bug...".
    3. Provide 3 progressive 'hints'.
       - Hint 1: Conceptual (What fields to look at).
       - Hint 2: Structural (Keywords to use).
       - Hint 3: Partial Syntax (e.g. "Try using WHERE payment_type = ...").
    4. Define 'validationCriteria' describing what the result set should contain.
    5. Set 'points' between 50 and 500 based on difficulty.
    
    Response must be JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            hints: { type: Type.ARRAY, items: { type: Type.STRING } },
            validationCriteria: { type: Type.STRING },
            points: { type: Type.INTEGER }
          },
          required: ['title', 'description', 'hints', 'validationCriteria', 'points']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      id: crypto.randomUUID(),
      datasetId: dataset.id,
      difficulty,
      ...data
    };
  } catch (e) {
    console.error("Failed to generate challenge", e);
    // Fallback for demo stability
    return {
      id: crypto.randomUUID(),
      title: "Data Exploration 101",
      description: "We need to verify the integrity of our main table. Select the first 10 rows to inspect the data formats.",
      hints: ["Use SELECT *", "Use LIMIT 10"],
      validationCriteria: "Returns 10 rows from the primary table.",
      points: 50,
      datasetId: dataset.id,
      difficulty
    };
  }
};

export const validateAndRunQuery = async (
  query: string, 
  dataset: Dataset, 
  challenge: Challenge | null
): Promise<{ result: QueryResult; validationMessage?: string; passed?: boolean; explanation?: string }> => {
  const ai = getAiClient();
  
  // 1. Safety Check (Regex)
  const forbidden = /INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|GRANT|REVOKE|EXECUTE/i;
  if (forbidden.test(query)) {
     return {
       result: {
         rows: [],
         columns: [],
         durationMs: 0,
         bytesProcessed: 0,
         costEstimate: 0,
         totalRowCount: 0,
         error: "Security Alert: Only SELECT statements are allowed. DML/DDL commands are blocked.",
         isDryRun: false
       }
     };
  }

  // 2. Simulate BigQuery Execution via LLM
  // We ask the LLM to generate realistic dummy data based on the schema and the query.
  const schemaDescription = dataset.tables.map(t => 
    `Table: ${t.name}\nColumns: ${t.columns.map(c => `${c.name} (${c.type})`).join(', ')}`
  ).join('\n\n');

  const executionPrompt = `
    Act as a Google BigQuery SQL Engine.
    Schema:
    ${schemaDescription}

    User Query: ${query}

    Instructions:
    1. Analyze the query against the schema.
    2. If the query is invalid (syntax error, wrong column names), return a JSON with a single key "error" describing the issue.
    3. If valid, generate a JSON object with:
       - "columns": array of string column names.
       - "rows": array of objects representing the result data.
         **IMPORTANT**: 
         - Generate exactly 50 rows of realistic sample data so the user can scroll.
         - If the query has a LIMIT N, generate N rows.
       - "totalRowCount": integer. ESTIMATE the total number of rows this query would return in a real full-scale database (e.g., if SELECT * FROM trips, say 14502).
       - "bytesProcessed": integer estimate.
       - "durationMs": integer execution time.
    
    Data Generation:
    - Create highly realistic data based on column types and the nature of the dataset (e.g. realistic taxi fares, real looking timestamps).
    - Handle nulls if appropriate.
    
    Response MUST be raw JSON.
  `;

  let executionData;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: executionPrompt,
      config: {
        responseMimeType: 'application/json',
        // responseSchema is omitted here because 'rows' contains dynamic keys which 
        // cannot be strictly typed in the schema (Type.OBJECT requires non-empty properties).
      }
    });
    executionData = JSON.parse(response.text || '{}');
  } catch (e) {
    return {
        result: {
            rows: [], columns: [], durationMs: 0, bytesProcessed: 0, costEstimate: 0, totalRowCount: 0,
            error: "Engine Simulation Error: " + (e as Error).message
        }
    }
  }

  if (executionData.error) {
    return {
      result: {
        rows: [],
        columns: [],
        durationMs: 0,
        bytesProcessed: 0,
        costEstimate: 0,
        totalRowCount: 0,
        error: executionData.error
      }
    };
  }

  const result: QueryResult = {
    rows: executionData.rows || [],
    columns: executionData.columns || [],
    durationMs: executionData.durationMs || 500,
    bytesProcessed: executionData.bytesProcessed || 1024,
    totalRowCount: executionData.totalRowCount || (executionData.rows || []).length,
    costEstimate: (executionData.bytesProcessed || 1024) * 0.000000005, // Rough BigQuery cost
    isDryRun: false
  };

  // 3. Validation Logic (If a challenge is active)
  let validationMessage = undefined;
  let passed = undefined;
  let explanation = undefined;

  if (challenge) {
    const validationPrompt = `
      Challenge Goal: ${challenge.description}
      Validation Criteria: ${challenge.validationCriteria}
      
      User Query: ${query}
      User Result Sample (First 3 rows): ${JSON.stringify(result.rows.slice(0, 3))}
      
      Tasks:
      1. Determine if the user solved the challenge (passed: boolean).
      2. Provide feedback message (feedback: string).
      3. Provide a brief educational explanation of WHY it is correct or what concept they missed (explanation: string).
         If they missed it, explain the concept (e.g. "You need a WHERE clause to filter").
      
      Return JSON.
    `;

    try {
      const valResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: validationPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              passed: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        }
      });
      const valData = JSON.parse(valResponse.text || '{}');
      passed = valData.passed;
      validationMessage = valData.feedback;
      explanation = valData.explanation;
    } catch (e) {
      console.warn("Validation check failed", e);
    }
  }

  return { result, validationMessage, passed, explanation };
};