-- ============================================
-- IMMO PULSE - Migration 0004 : preuve d'acceptation des CGU
-- ============================================
-- Article 8 des CGU : la date et la version de l'acceptation sont
-- enregistrées côté serveur (récupérables en interne si besoin).

ALTER TABLE users ADD COLUMN cgu_version TEXT;
ALTER TABLE users ADD COLUMN cgu_accepted_at DATETIME;
