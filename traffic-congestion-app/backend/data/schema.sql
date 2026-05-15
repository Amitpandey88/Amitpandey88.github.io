CREATE TABLE IF NOT EXISTS traffic_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  traffic_volume REAL NOT NULL,
  average_speed_kmh REAL NOT NULL,
  weather TEXT NOT NULL,
  rain_mm REAL NOT NULL,
  accident INTEGER NOT NULL,
  event INTEGER NOT NULL,
  public_transport_density REAL NOT NULL,
  congestion_level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  location TEXT NOT NULL,
  predicted_congestion TEXT NOT NULL,
  confidence REAL NOT NULL,
  risk_level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS routes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  mode TEXT NOT NULL,
  route_name TEXT NOT NULL,
  eta_minutes INTEGER NOT NULL,
  distance_km REAL NOT NULL,
  traffic_level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS toll_estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  route_name TEXT NOT NULL,
  estimated_toll REAL NOT NULL,
  toll_checkpoints INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chatbot_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  user_query TEXT NOT NULL,
  bot_response TEXT NOT NULL
);
