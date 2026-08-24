-- ============================================
-- IMMO PULSE - Migration 0005 : champs CRM pour le Bridge (extension Chrome)
-- ============================================
-- L'endpoint GET /api/bridge/prospects expose les contacts au format attendu
-- par le CRM : prénom, email, anniversaire, adresse, notes, et un updated_at
-- pour la synchronisation incrémentale (paramètre ?since=YYYY-MM-DD).

ALTER TABLE contacts ADD COLUMN first_name TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN email TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN birthdate TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN address TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN zip_code TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN city TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN notes TEXT DEFAULT '';
ALTER TABLE contacts ADD COLUMN updated_at DATETIME;

-- Les lignes existantes n'ont jamais été modifiées : leur dernière
-- mise à jour connue est leur date de création.
UPDATE contacts SET updated_at = created_at;
