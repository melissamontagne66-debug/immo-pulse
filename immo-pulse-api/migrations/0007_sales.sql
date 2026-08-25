-- ============================================
-- IMMO PULSE - Migration 0007 : ventes enregistrées (commissions)
-- ============================================
-- Les ventes saisies dans le calculateur de commission doivent persister par
-- compte et être consultables depuis n'importe quel appareil, comme les
-- bilans et les contacts. Tableau JSON par utilisateur — même pattern que
-- profiles (une ligne par user, INSERT OR REPLACE).

CREATE TABLE IF NOT EXISTS sales (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL DEFAULT '[]',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
