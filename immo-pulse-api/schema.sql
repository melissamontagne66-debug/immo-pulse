-- ============================================
-- IMMO PULSE - Base de données Cloudflare D1
-- ============================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  experience_level TEXT DEFAULT 'debutant',
  start_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des profils (JSON complet)
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  progress TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des demandes de réinitialisation de mot de passe
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des résultats quotidiens
CREATE TABLE IF NOT EXISTS daily_results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  calls_made INTEGER DEFAULT 0,
  contacts_approached INTEGER DEFAULT 0,
  rdv_r1_done INTEGER DEFAULT 0,
  rdv_r2_done INTEGER DEFAULT 0,
  mandats_signed INTEGER DEFAULT 0,
  visites_done INTEGER DEFAULT 0,
  offres_written INTEGER DEFAULT 0,
  mood INTEGER DEFAULT 3,
  wins TEXT,
  challenges TEXT,
  coach_question TEXT,
  coach_answer TEXT,
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des comptes rendus de visite
CREATE TABLE IF NOT EXISTS visit_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  property_address TEXT NOT NULL,
  seller_name TEXT,
  buyer_name TEXT,
  status TEXT DEFAULT 'interesse',
  price_feedback TEXT,
  location_feedback TEXT,
  work_feedback TEXT,
  general_feedback TEXT,
  weak_points TEXT,
  strong_points TEXT,
  generated_message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des contacts chauds (mini-carnet de prospects)
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  context TEXT,
  origin TEXT,
  follow_up_date TEXT,
  status TEXT DEFAULT 'chaud',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des actions complétées
CREATE TABLE IF NOT EXISTS completed_actions (
  user_id TEXT NOT NULL,
  action_id TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, action_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
