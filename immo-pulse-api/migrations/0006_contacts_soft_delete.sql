-- ============================================
-- IMMO PULSE - Migration 0006 : soft-delete des contacts
-- ============================================
-- DELETE /api/contacts ne supprime plus la ligne : il pose deleted_at.
-- Sans ça, une suppression était invisible pour la sync incrémentale du
-- Bridge CRM (?since=) et le CRM conservait des prospects supprimés.
-- Les tombstones ne sont jamais renvoyées à l'app (/api/sync les exclut)
-- et la suppression de compte reste un hard delete complet (RGPD).

ALTER TABLE contacts ADD COLUMN deleted_at DATETIME;
