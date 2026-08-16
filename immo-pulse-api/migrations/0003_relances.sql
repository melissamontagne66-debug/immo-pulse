-- ============================================
-- IMMO PULSE - Migration 0003 : relances email + push
-- ============================================

-- Abonnements aux notifications push (tokens FCM par appareil)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  fcm_token TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Journal des emails envoyés (anti-doublon + suivi quota Resend)
-- kind : 'no_bilan' | 'inactive_3d' | 'milestone:<palier>'
CREATE TABLE IF NOT EXISTS email_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'sent',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dernière activité de l'utilisateur (sert à cibler les relances).
-- NB : SQLite refuse DEFAULT CURRENT_TIMESTAMP dans un ALTER TABLE ADD COLUMN
-- (défaut non constant) — d'où la colonne sans défaut + backfill.
ALTER TABLE users ADD COLUMN last_seen_at DATETIME;
UPDATE users SET last_seen_at = datetime('now') WHERE last_seen_at IS NULL;

-- Désinscription des emails de relance (lien en bas de chaque email)
ALTER TABLE users ADD COLUMN email_opt_out INTEGER DEFAULT 0;
