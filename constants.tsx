
import { Dataset, UserProfile, SystemLog } from "./types";
import { Database, TrendingUp, Github, Book, MessageSquare, Layers, Bike, Globe } from "lucide-react";
import React from 'react';

export const DATASETS: Dataset[] = [
  {
    id: "nyc-taxi",
    name: "NYC Taxi Trips",
    description: "Data on millions of taxi trips in New York City, including fares, locations, and timestamps.",
    icon: "taxi",
    tables: [
      {
        name: "trips",
        columns: [
          { name: "pickup_datetime", type: "TIMESTAMP" },
          { name: "dropoff_datetime", type: "TIMESTAMP" },
          { name: "passenger_count", type: "INTEGER" },
          { name: "trip_distance", type: "FLOAT" },
          { name: "fare_amount", type: "FLOAT" },
          { name: "payment_type", type: "STRING" }
        ]
      },
      {
        name: "zones",
        columns: [
          { name: "zone_id", type: "INTEGER" },
          { name: "zone_name", type: "STRING" },
          { name: "borough", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "google_trends",
    name: "Google Trends",
    description: "Search interest data for various terms over time.",
    icon: "chart",
    tables: [
      {
        name: "international_top_terms",
        columns: [
          { name: "term", type: "STRING" },
          { name: "country_name", type: "STRING" },
          { name: "week", type: "DATE" },
          { name: "score", type: "INTEGER" },
          { name: "rank", type: "INTEGER" }
        ]
      }
    ]
  },
  {
    id: "github_repos",
    name: "GitHub Public Data",
    description: "Commits, languages, and licenses from public repositories.",
    icon: "github",
    tables: [
      {
        name: "commits",
        columns: [
          { name: "commit", type: "STRING" },
          { name: "author", type: "STRING" },
          { name: "message", type: "STRING" },
          { name: "repo_name", type: "STRING" }
        ]
      },
      {
        name: "languages",
        columns: [
          { name: "repo_name", type: "STRING" },
          { name: "language", type: "STRING" },
          { name: "bytes", type: "INTEGER" }
        ]
      }
    ]
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    description: "Questions, answers, and user data from the world's largest developer community.",
    icon: "stackoverflow",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "display_name", type: "STRING" },
          { name: "reputation", type: "INTEGER" },
          { name: "creation_date", type: "TIMESTAMP" },
          { name: "location", type: "STRING" }
        ]
      },
      {
        name: "posts_questions",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "title", type: "STRING" },
          { name: "body", type: "STRING" },
          { name: "owner_user_id", type: "INTEGER" },
          { name: "score", type: "INTEGER" },
          { name: "tags", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "austin_bikeshare",
    name: "Austin Bike Share",
    description: "Austin B-Cycle trips and station statuses.",
    icon: "bike",
    tables: [
      {
        name: "trips",
        columns: [
          { name: "trip_id", type: "INTEGER" },
          { name: "subscriber_type", type: "STRING" },
          { name: "start_station_name", type: "STRING" },
          { name: "end_station_name", type: "STRING" },
          { name: "duration_minutes", type: "INTEGER" },
          { name: "start_time", type: "TIMESTAMP" }
        ]
      },
      {
        name: "stations",
        columns: [
          { name: "station_id", type: "INTEGER" },
          { name: "name", type: "STRING" },
          { name: "status", type: "STRING" },
          { name: "location", type: "GEOGRAPHY" }
        ]
      }
    ]
  },
  {
    id: "hacker_news",
    name: "Hacker News",
    description: "Stories and comments from Y Combinator's Hacker News.",
    icon: "news",
    tables: [
      {
        name: "stories",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "title", type: "STRING" },
          { name: "url", type: "STRING" },
          { name: "score", type: "INTEGER" },
          { name: "time", type: "TIMESTAMP" },
          { name: "by", type: "STRING" }
        ]
      },
      {
        name: "comments",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "text", type: "STRING" },
          { name: "parent", type: "INTEGER" },
          { name: "time", type: "TIMESTAMP" },
          { name: "by", type: "STRING" }
        ]
      }
    ]
  }
];

export const MOCK_USER: UserProfile = {
  id: "user_123",
  email: "demo@sqlquest.com",
  name: "DataExplorer",
  role: "user",
  level: 5,
  xp: 4500,
  stars: 12,
  completedChallenges: [],
  joinDate: "2023-01-01T12:00:00Z"
};

export const DATASET_ICONS: Record<string, React.ReactNode> = {
  "nyc-taxi": <Database className="w-6 h-6 text-yellow-500" />,
  "google_trends": <TrendingUp className="w-6 h-6 text-blue-500" />,
  "github_repos": <Github className="w-6 h-6 text-white" />,
  "stackoverflow": <Layers className="w-6 h-6 text-orange-500" />,
  "austin_bikeshare": <Bike className="w-6 h-6 text-green-500" />,
  "hacker_news": <Globe className="w-6 h-6 text-orange-400" />
};

export const MOCK_ADMIN_LOGS: SystemLog[] = [
    { id: '1', userId: 'user_882', action: 'Completed Challenge: "Find Top Earners"', timestamp: '2 mins ago', status: 'success' },
    { id: '2', userId: 'user_192', action: 'Failed Login Attempt', timestamp: '5 mins ago', status: 'warning' },
    { id: '3', userId: 'user_443', action: 'Query Blocked: DROP TABLE detected', timestamp: '12 mins ago', status: 'error' },
    { id: '4', userId: 'user_882', action: 'Started Quest: NYC Taxi', timestamp: '15 mins ago', status: 'info' },
    { id: '5', userId: 'user_101', action: 'New User Signup', timestamp: '1 hour ago', status: 'success' },
];

export const MOCK_USERS_LIST = [
    { id: 'u1', name: 'Alice Data', email: 'alice@example.com', role: 'user', lastActive: 'Now' },
    { id: 'u2', name: 'Bob Query', email: 'bob@example.com', role: 'user', lastActive: '5m ago' },
    { id: 'u3', name: 'Charlie Drop', email: 'charlie@evil.com', role: 'user', lastActive: '2d ago' },
    { id: 'u4', name: 'Admin One', email: 'admin@sqlquest.com', role: 'admin', lastActive: 'Now' },
];
