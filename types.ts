

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  tables: TableSchema[];
  icon: string;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface ColumnSchema {
  name: string;
  type: string;
  description?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  datasetId: string;
  hints: string[];
  expectedSql?: string; // For internal validation simulation
  validationCriteria: string; // Instructions for the LLM to validate
  points: number;
}

export interface QueryResult {
  rows: any[];
  columns: string[];
  durationMs: number;
  bytesProcessed: number;
  totalRowCount: number; // Simulated total rows in DB
  costEstimate: number; // In USD (fictional small amount)
  error?: string;
  isDryRun?: boolean;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  level: number;
  xp: number;
  stars: number;
  completedChallenges: string[]; // IDs
  avatar?: string; // color hex or id
  theme?: 'cosmic' | 'midnight' | 'nebula';
  joinDate: string;
}

export interface QueryLog {
  id: string;
  query: string;
  timestamp: Date;
  status: 'success' | 'error' | 'blocked';
  bytesProcessed: number;
  datasetId: string;
  difficulty: Difficulty;
}

export enum GameView {
  AUTH = 'AUTH',
  HOME = 'HOME',
  QUEST = 'QUEST',
  LEADERBOARD = 'LEADERBOARD',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN',
  SETTINGS = 'SETTINGS'
}

export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  status: 'info' | 'warning' | 'error' | 'success';
}

export interface AdminStats {
  totalUsers: number;
  activeQueries: number;
  blockedThreats: number;
  estCost: number;
}