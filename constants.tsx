
import { Dataset, UserProfile, SystemLog } from "./types";
import { Database, TrendingUp, Github, Layers, Bike, Globe } from "lucide-react";
import React from 'react';

export const DATASETS: Dataset[] = [
  {
    id: "nyc-taxi",
    name: "NYC Taxi Trips",
    description: "Real-world taxi data including fares, payment types, locations, and complex rate codes.",
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
          { name: "extra", type: "FLOAT" },
          { name: "mta_tax", type: "FLOAT" },
          { name: "tip_amount", type: "FLOAT" },
          { name: "tolls_amount", type: "FLOAT" },
          { name: "improvement_surcharge", type: "FLOAT" },
          { name: "total_amount", type: "FLOAT" },
          { name: "payment_type", type: "STRING" },
          { name: "pickup_location_id", type: "INTEGER" },
          { name: "dropoff_location_id", type: "INTEGER" },
          { name: "vendor_id", type: "STRING" },
          { name: "rate_code", type: "INTEGER" },
          { name: "store_and_fwd_flag", type: "STRING" }
        ]
      },
      {
        name: "taxi_zone_geom",
        columns: [
          { name: "zone_id", type: "INTEGER" },
          { name: "zone_name", type: "STRING" },
          { name: "borough", type: "STRING" },
          { name: "zone_geom", type: "GEOGRAPHY" }
        ]
      },
      {
        name: "rate_codes",
        columns: [
          { name: "rate_code_id", type: "INTEGER" },
          { name: "description", type: "STRING" }
        ]
      },
      {
        name: "payment_lookup",
        columns: [
          { name: "payment_type_id", type: "STRING" },
          { name: "payment_description", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "google_trends",
    name: "Google Trends",
    description: "Search interest data for various terms over time, including international and metro-level breakdowns.",
    icon: "chart",
    tables: [
      {
        name: "international_top_terms",
        columns: [
          { name: "term", type: "STRING" },
          { name: "country_name", type: "STRING" },
          { name: "region_name", type: "STRING" },
          { name: "week", type: "DATE" },
          { name: "score", type: "INTEGER" },
          { name: "rank", type: "INTEGER" },
          { name: "percent_gain", type: "FLOAT" },
          { name: "refresh_date", type: "TIMESTAMP" }
        ]
      },
      {
        name: "top_rising_terms",
        columns: [
          { name: "term", type: "STRING" },
          { name: "country_code", type: "STRING" },
          { name: "week", type: "DATE" },
          { name: "growth_percentage", type: "FLOAT" }
        ]
      },
      {
        name: "us_metro_map",
        columns: [
          { name: "dma_id", type: "INTEGER" },
          { name: "dma_name", type: "STRING" },
          { name: "state_name", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "github_repos",
    name: "GitHub Public Data",
    description: "Massive dataset of open source code, commits, licenses, and file contents.",
    icon: "github",
    tables: [
      {
        name: "commits",
        columns: [
          { name: "commit", type: "STRING" },
          { name: "tree", type: "STRING" },
          { name: "parent", type: "STRING" },
          { name: "author", type: "STRING" },
          { name: "committer", type: "STRING" },
          { name: "subject", type: "STRING" },
          { name: "message", type: "STRING" },
          { name: "repo_name", type: "STRING" },
          { name: "encoding", type: "STRING" }
        ]
      },
      {
        name: "languages",
        columns: [
          { name: "repo_name", type: "STRING" },
          { name: "language", type: "STRING" },
          { name: "bytes", type: "INTEGER" }
        ]
      },
      {
        name: "licenses",
        columns: [
          { name: "repo_name", type: "STRING" },
          { name: "license", type: "STRING" }
        ]
      },
      {
        name: "files",
        columns: [
          { name: "repo_name", type: "STRING" },
          { name: "path", type: "STRING" },
          { name: "mode", type: "INTEGER" },
          { name: "id", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    description: "Complete archive of Stack Overflow questions, answers, comments, badges and user reputation.",
    icon: "stackoverflow",
    tables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "display_name", type: "STRING" },
          { name: "about_me", type: "STRING" },
          { name: "age", type: "INTEGER" },
          { name: "creation_date", type: "TIMESTAMP" },
          { name: "last_access_date", type: "TIMESTAMP" },
          { name: "location", type: "STRING" },
          { name: "reputation", type: "INTEGER" },
          { name: "up_votes", type: "INTEGER" },
          { name: "down_votes", type: "INTEGER" },
          { name: "views", type: "INTEGER" },
          { name: "profile_image_url", type: "STRING" }
        ]
      },
      {
        name: "posts_questions",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "title", type: "STRING" },
          { name: "body", type: "STRING" },
          { name: "accepted_answer_id", type: "INTEGER" },
          { name: "answer_count", type: "INTEGER" },
          { name: "comment_count", type: "INTEGER" },
          { name: "creation_date", type: "TIMESTAMP" },
          { name: "favorite_count", type: "INTEGER" },
          { name: "owner_user_id", type: "INTEGER" },
          { name: "score", type: "INTEGER" },
          { name: "tags", type: "STRING" },
          { name: "view_count", type: "INTEGER" }
        ]
      },
      {
        name: "posts_answers",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "body", type: "STRING" },
          { name: "comment_count", type: "INTEGER" },
          { name: "creation_date", type: "TIMESTAMP" },
          { name: "owner_user_id", type: "INTEGER" },
          { name: "parent_id", type: "INTEGER" },
          { name: "score", type: "INTEGER" }
        ]
      },
      {
        name: "comments",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "text", type: "STRING" },
          { name: "creation_date", type: "TIMESTAMP" },
          { name: "post_id", type: "INTEGER" },
          { name: "user_id", type: "INTEGER" },
          { name: "score", type: "INTEGER" }
        ]
      },
      {
        name: "badges",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "STRING" },
          { name: "date", type: "TIMESTAMP" },
          { name: "user_id", type: "INTEGER" },
          { name: "class", type: "INTEGER" },
          { name: "tag_based", type: "BOOLEAN" }
        ]
      }
    ]
  },
  {
    id: "austin_bikeshare",
    name: "Austin Bike Share",
    description: "Bike share trips, station status, and local weather data.",
    icon: "bike",
    tables: [
      {
        name: "bikeshare_trips",
        columns: [
          { name: "trip_id", type: "INTEGER" },
          { name: "subscriber_type", type: "STRING" },
          { name: "bike_id", type: "STRING" },
          { name: "start_time", type: "TIMESTAMP" },
          { name: "start_station_id", type: "INTEGER" },
          { name: "start_station_name", type: "STRING" },
          { name: "end_station_id", type: "INTEGER" },
          { name: "end_station_name", type: "STRING" },
          { name: "duration_minutes", type: "INTEGER" }
        ]
      },
      {
        name: "bikeshare_stations",
        columns: [
          { name: "station_id", type: "INTEGER" },
          { name: "name", type: "STRING" },
          { name: "status", type: "STRING" },
          { name: "address", type: "STRING" },
          { name: "alternate_name", type: "STRING" },
          { name: "city_asset_number", type: "INTEGER" },
          { name: "property_type", type: "STRING" },
          { name: "number_of_docks", type: "INTEGER" },
          { name: "power_type", type: "STRING" },
          { name: "footprint_length", type: "INTEGER" },
          { name: "footprint_width", type: "INTEGER" },
          { name: "location", type: "GEOGRAPHY" }
        ]
      },
      {
        name: "weather",
        columns: [
          { name: "date", type: "DATE" },
          { name: "temp_high", type: "FLOAT" },
          { name: "temp_low", type: "FLOAT" },
          { name: "precip", type: "FLOAT" },
          { name: "events", type: "STRING" }
        ]
      }
    ]
  },
  {
    id: "hacker_news",
    name: "Hacker News",
    description: "Stories, comments, jobs, and pollution data from Y Combinator.",
    icon: "news",
    tables: [
      {
        name: "full",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "title", type: "STRING" },
          { name: "url", type: "STRING" },
          { name: "text", type: "STRING" },
          { name: "dead", type: "BOOLEAN" },
          { name: "by", type: "STRING" },
          { name: "score", type: "INTEGER" },
          { name: "time", type: "INTEGER" },
          { name: "timestamp", type: "TIMESTAMP" },
          { name: "type", type: "STRING" },
          { name: "parent", type: "INTEGER" },
          { name: "descendants", type: "INTEGER" },
          { name: "ranking", type: "INTEGER" },
          { name: "deleted", type: "BOOLEAN" }
        ]
      },
      {
        name: "stories",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "by", type: "STRING" },
          { name: "score", type: "INTEGER" },
          { name: "time", type: "INTEGER" },
          { name: "time_ts", type: "TIMESTAMP" },
          { name: "title", type: "STRING" },
          { name: "url", type: "STRING" },
          { name: "text", type: "STRING" },
          { name: "deleted", type: "BOOLEAN" },
          { name: "dead", type: "BOOLEAN" },
          { name: "descendants", type: "INTEGER" },
          { name: "author", type: "STRING" }
        ]
      },
      {
        name: "comments",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "by", type: "STRING" },
          { name: "author", type: "STRING" },
          { name: "time", type: "INTEGER" },
          { name: "time_ts", type: "TIMESTAMP" },
          { name: "text", type: "STRING" },
          { name: "parent", type: "INTEGER" },
          { name: "deleted", type: "BOOLEAN" },
          { name: "dead", type: "BOOLEAN" },
          { name: "ranking", type: "INTEGER" }
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
