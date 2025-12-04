
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

export const generateChallenge = async (dataset: Dataset, difficulty: Difficulty): Promise<Challenge> => {
  const ai = getAiClient();
  const schemaDescription = dataset.tables.map(t => 
    `Table: ${t.name}\nColumns: ${t.columns.map(c => `${c.name} (${c.type})`).join(', ')}`
  ).join('\n\n');

  let difficultyConstraints = "";
  if (difficulty === 'Beginner') {
    difficultyConstraints = `
      STRICT CONSTRAINT: VERY SIMPLE QUERIES ONLY.
      - Use ONLY single-table SELECT statements.
      - NO Joins.
      - NO Group By.
      - NO Subqueries.
      - Basic WHERE clauses only (e.g. specific IDs, exact string matches, simple numbers).
      - Example goal: "Find the name of the user with ID 5" or "List all rows where status is 'active'".
    `;
  } else if (difficulty === 'Intermediate') {
    difficultyConstraints = `
      CONSTRAINT: Moderate complexity.
      - Use INNER JOIN or LEFT JOIN.
      - Use Aggregate functions (COUNT, SUM, AVG) with GROUP BY.
      - Standard business reporting questions.
    `;
  } else {
    difficultyConstraints = `
      CONSTRAINT: Advanced SQL.
      - Use Window Functions (ROW_NUMBER, RANK).
      - Use CTEs (Common Table Expressions).
      - Complex Joins or Self Joins.
      - Subqueries or HAVING clauses.
    `;
  }

  const prompt = `
    You are a SQL instructor creating a challenge for a student.
    Dataset: ${dataset.name}
    Difficulty: ${difficulty}
    
    ${difficultyConstraints}

    Schema:
    ${schemaDescription}

    Create a unique SQL challenge. 
    1. The 'title' should be catchy.
    2. The 'description' should be a clear business question requesting data.
    3. Provide 3 progressive 'hints' that guide the user on concepts (e.g., "Think about filtering the results using...").
    4. Define 'validationCriteria' describing what the result set should contain.
    
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
      title: "Simple Select",
      description: "Select the first 10 rows from the main table.",
      hints: ["Use SELECT *", "Use LIMIT 10"],
      validationCriteria: "Returns 10 rows",
      points: 10,
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
       - "rows": array of objects representing the result data (max 10 rows). Keys must match column names.
       - "bytesProcessed": integer estimate.
       - "durationMs": integer execution time.
    
    Data Generation:
    - Create realistic data based on column types.
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
            rows: [], columns: [], durationMs: 0, bytesProcessed: 0, costEstimate: 0,
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
        error: executionData.error
      }
    };
  }

  const result: QueryResult = {
    rows: executionData.rows || [],
    columns: executionData.columns || [],
    durationMs: executionData.durationMs || 500,
    bytesProcessed: executionData.bytesProcessed || 1024,
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
      User Result Sample: ${JSON.stringify(result.rows.slice(0, 3))}
      
      Tasks:
      1. Determine if the user solved the challenge (passed: boolean).
      2. Provide feedback message (feedback: string).
      3. Provide a brief educational explanation of WHY it is correct or what concept they missed (explanation: string).
      
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
