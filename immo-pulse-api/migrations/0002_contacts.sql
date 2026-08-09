-- ============================================
-- IMMO PULSE - Migration 0002 : carnet de contacts chauds
-- ============================================

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
