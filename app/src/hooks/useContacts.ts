import { useState, useCallback, useRef, useEffect } from 'react';
import { apiSaveContact, apiDeleteContact, isCloudEnabled } from '@/services/api';
import { toLocalDateKey } from '@/lib/utils';

// ============================================
// Mini-carnet de contacts chauds (MOD-14)
// localStorage : iad-coach-contacts-{userKey}
// Sync API : POST/DELETE /api/contacts + GET /api/sync
// ============================================

export type ContactStatut = 'chaud' | 'tiède' | 'froid';
export type ContactOrigine = 'pige' | 'porte-a-porte' | 'bouche-a-oreille' | 'apporteur' | 'autre';
export type ContactTypeProspect = 'acheteur' | 'vendeur' | 'sans-projet' | '';
export type ContactOccupancy = 'proprietaire' | 'locataire' | '';
export type DelaiRelance = '1-semaine' | '15-jours' | '1-mois' | '3-mois' | 'personnalise' | '';

export interface ContactNote {
  id: string;
  date: string;   // YYYY-MM-DD
  texte: string;
}

export interface Contact {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  contexte: string;
  origine: ContactOrigine;
  typeProspect: ContactTypeProspect;
  occupancy: ContactOccupancy;
  adresse: string;
  codePostal: string;
  ville: string;
  quartier: string;
  anniversaire: string;        // YYYY-MM-DD ('' si inconnu)
  dateRelance: string;         // YYYY-MM-DD ('' si pas de relance prévue)
  dateDerniereRelance: string; // YYYY-MM-DD ('' si jamais relancé)
  notes: ContactNote[];
  createdAt: string;
  statut: ContactStatut;
}

const STORAGE_PREFIX = 'iad-coach-contacts';

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

// Migration douce : les contacts créés avant l'enrichissement reçoivent
// les nouveaux champs vides par défaut.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateContact(raw: any): Contact {
  const origines: ContactOrigine[] = ['pige', 'porte-a-porte', 'bouche-a-oreille', 'apporteur'];
  return {
    id: raw.id,
    nom: raw.nom || '',
    prenom: raw.prenom || '',
    telephone: raw.telephone || '',
    email: raw.email || '',
    contexte: raw.contexte || '',
    origine: origines.includes(raw.origine) ? raw.origine : (raw.origine ? 'autre' : 'autre'),
    typeProspect: raw.typeProspect === 'acheteur' || raw.typeProspect === 'vendeur' || raw.typeProspect === 'sans-projet' ? raw.typeProspect : '',
    occupancy: raw.occupancy === 'proprietaire' || raw.occupancy === 'locataire' ? raw.occupancy : '',
    adresse: raw.adresse || '',
    codePostal: raw.codePostal || '',
    ville: raw.ville || '',
    quartier: raw.quartier || '',
    anniversaire: raw.anniversaire || '',
    dateRelance: raw.dateRelance || '',
    dateDerniereRelance: raw.dateDerniereRelance || '',
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    createdAt: raw.createdAt || '',
    statut: (raw.statut === 'tiède' || raw.statut === 'froid') ? raw.statut : 'chaud',
  };
}

function loadContacts(userKey: string): Contact[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (stored) return (JSON.parse(stored) as any[]).map(migrateContact);
  } catch { /* ignore */ }
  return [];
}

// ============================================
// Purge RGPD (article 3 des CGU) : une fiche prospect sans aucune
// interaction enregistrée (relance, note, modification) pendant 90 jours
// est automatiquement et définitivement supprimée — local ET cloud.
// La dernière interaction = max(createdAt, dateDerniereRelance, dernière note).
// ============================================
const PURGE_DAYS = 90;

function lastInteractionKey(c: Contact): string {
  const candidates = [c.createdAt?.slice(0, 10) ?? '', c.dateDerniereRelance ?? ''];
  for (const n of c.notes ?? []) if (n.date) candidates.push(n.date);
  return candidates.filter(Boolean).sort().pop() ?? '';
}

// Date de « dernière mise à jour » d'une fiche = dernière interaction
// (relance effective ou note), fallback createdAt — utilisée par le filtre
// « Dernière mise à jour » de ContactsView.
export function getContactLastUpdate(c: Contact): string {
  return lastInteractionKey(c) || (c.createdAt?.slice(0, 10) ?? '');
}

function purgeExpired(userKey: string, contacts: Contact[]): Contact[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PURGE_DAYS);
  const cutoffKey = toLocalDateKey(cutoff);
  const expired = contacts.filter(c => {
    const last = lastInteractionKey(c);
    return last && last < cutoffKey;
  });
  if (expired.length === 0) return contacts;
  // Purge RGPD : suppression TOTALE (hard delete) — un prospect sans
  // interaction depuis 90 jours ne doit persister nulle part, pas même
  // en tombstone pour le Bridge CRM.
  expired.forEach(c => deleteFromCloud(c.id, true));
  const kept = contacts.filter(c => !expired.some(e => e.id === c.id));
  saveContacts(userKey, kept);
  return kept;
}

// ============================================
// Alerte 80 jours (demande client) : contacts sans AUCUNE interaction
// (relance, note, modification) depuis 80 jours ou plus → le conseiller
// doit les rappeler / leur écrire avant la purge automatique à 90 jours.
// Une relance simplement PLANIFIÉE ne suffit PAS à sortir de la liste :
// seules une note d'échange ou une relance effective (dernière relance
// renseignée) comptent comme interaction réelle.
// ============================================
const ALERTE_INACTIVITE_JOURS = 80;

export interface ContactInactif {
  contact: Contact;
  derniereInteraction: string; // YYYY-MM-DD
  joursSansInteraction: number;
}

export function getContactsInactifs(contacts: Contact[]): ContactInactif[] {
  const now = Date.now();
  return contacts
    .map(c => {
      const last = lastInteractionKey(c);
      if (!last) return null;
      const jours = Math.floor((now - new Date(`${last}T12:00:00`).getTime()) / 86400000);
      if (jours < ALERTE_INACTIVITE_JOURS) return null;
      return { contact: c, derniereInteraction: last, joursSansInteraction: jours };
    })
    .filter((x): x is ContactInactif => x !== null)
    .sort((a, b) => b.joursSansInteraction - a.joursSansInteraction);
}

// ============================================
// Anniversaires du jour : toute fiche dont la date d'anniversaire
// (jour + mois) tombe aujourd'hui → tâche « message ou appel » du jour.
// ============================================
export function getContactsAnniversaireDuJour(contacts: Contact[]): Contact[] {
  const now = new Date();
  const jourMois = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayKey = toLocalDateKey(now);
  // « Fait » = souhaité aujourd'hui (dernière interaction datée du jour) →
  // la carte disparaît pour ne pas relancer un contact déjà appelé.
  return contacts.filter(c =>
    c.anniversaire && c.anniversaire.slice(5) === jourMois && c.dateDerniereRelance !== todayKey
  );
}

function saveContacts(userKey: string, contacts: Contact[]) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(contacts));
}

// Mapping front (FR) → API (EN, calqué sur les colonnes SQL)
function toApiContact(contact: Contact) {
  return {
    id: contact.id,
    name: contact.nom,
    firstName: contact.prenom,
    phone: contact.telephone,
    email: contact.email,
    birthdate: contact.anniversaire,
    address: contact.adresse,
    zipCode: contact.codePostal,
    city: contact.ville,
    // Notes aplaties en texte lisible (« 2026-08-24: … ») — le Bridge CRM
    // les renvoie telles quelles dans le champ `notes` de l'endpoint.
    notes: (contact.notes ?? []).map(n => `${n.date}: ${n.texte}`).join('\n'),
    context: contact.contexte,
    origin: contact.origine,
    followUpDate: contact.dateRelance || null,
    status: contact.statut,
    createdAt: contact.createdAt,
  };
}

// Mapping API (EN) → front (FR) — avec migration douce vers le modèle enrichi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromApiContact(raw: any): Contact {
  return migrateContact({
    id: raw.id,
    nom: raw.name || '',
    prenom: raw.firstName || '',
    telephone: raw.phone || '',
    email: raw.email || '',
    anniversaire: raw.birthdate || '',
    adresse: raw.address || '',
    codePostal: raw.zipCode || '',
    ville: raw.city || '',
    contexte: raw.context || '',
    origine: raw.origin || '',
    dateRelance: raw.followUpDate || '',
    createdAt: raw.createdAt || '',
    statut: (raw.status === 'tiède' || raw.status === 'froid') ? raw.status : 'chaud',
  });
}

function pushToCloud(contact: Contact) {
  if (!isCloudEnabled()) return;
  apiSaveContact(toApiContact(contact)).catch(() => { /* silencieux : local déjà à jour */ });
}

function deleteFromCloud(id: string, hard = false) {
  if (!isCloudEnabled()) return;
  apiDeleteContact(id, hard).catch(() => { /* silencieux : local déjà à jour */ });
}

export function useContacts(userKey: string) {
  const [contacts, setContacts] = useState<Contact[]>(() => purgeExpired(userKey, loadContacts(userKey)));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContacts(purgeExpired(userKey, loadContacts(userKey)));
    }
  }, [userKey]);

  // Purge RGPD à l'ouverture (une fois par session)
  useEffect(() => {
    setContacts(prev => purgeExpired(loadedKey.current, prev));
  }, []);

  // Inject cloud data (called from App.tsx after apiSyncLoad)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadFromCloud = useCallback((cloudContacts: any[] | null) => {
    if (!cloudContacts || cloudContacts.length === 0) return;
    const mapped = cloudContacts.map(fromApiContact);
    setContacts(prev => {
      // Merge: cloud contacts + local contacts not in cloud (by id)
      const cloudIds = new Set(mapped.map(c => c.id));
      const localOnly = prev.filter(c => !cloudIds.has(c.id));
      const merged = [...mapped, ...localOnly];
      saveContacts(loadedKey.current, merged);
      return merged;
    });
  }, []);

  const addContact = useCallback((data: Omit<Contact, 'id' | 'createdAt'>): Contact => {
    const contact: Contact = {
      ...data,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setContacts(prev => {
      const updated = [contact, ...prev];
      saveContacts(loadedKey.current, updated);
      return updated;
    });
    pushToCloud(contact);
    return contact;
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Omit<Contact, 'id'>>) => {
    setContacts(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveContacts(loadedKey.current, updated);
      const contact = updated.find(c => c.id === id);
      if (contact) pushToCloud(contact);
      return updated;
    });
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveContacts(loadedKey.current, updated);
      return updated;
    });
    // Suppression totale (hard delete), comme la purge RGPD : un contact
    // supprimé par le conseiller ne doit persister nulle part.
    deleteFromCloud(id, true);
  }, []);

  // Repousse la relance au lendemain
  const postponeContact = useCallback((id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateContact(id, { dateRelance: toLocalDateKey(tomorrow) });
  }, [updateContact]);

  // Ajoute une note à l'historique du prospect
  const addNote = useCallback((id: string, texte: string) => {
    const trimmed = texte.trim();
    if (!trimmed) return;
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        const note = { id: `note-${Date.now()}`, date: toLocalDateKey(new Date()), texte: trimmed };
        return { ...c, notes: [note, ...(c.notes ?? [])] };
      });
      saveContacts(loadedKey.current, updated);
      const contact = updated.find(c => c.id === id);
      if (contact) pushToCloud(contact);
      return updated;
    });
  }, []);

  // Planifie une relance depuis un délai choisi (ou une date exacte si personnalisé)
  const planifierRelance = useCallback((id: string, delai: DelaiRelance, dateExacte?: string) => {
    if (delai === 'personnalise' && dateExacte) {
      updateContact(id, { dateRelance: dateExacte });
      return;
    }
    const jours = delai === '1-semaine' ? 7 : delai === '15-jours' ? 15 : delai === '1-mois' ? 30 : delai === '3-mois' ? 90 : 0;
    if (jours === 0) return;
    const d = new Date();
    d.setDate(d.getDate() + jours);
    updateContact(id, { dateRelance: toLocalDateKey(d) });
  }, [updateContact]);

  // Contacts triés par date de relance (les plus urgents d'abord, sans date à la fin)
  const sortedContacts = useCallback((): Contact[] => {
    return [...contacts].sort((a, b) => {
      if (!a.dateRelance && !b.dateRelance) return 0;
      if (!a.dateRelance) return 1;
      if (!b.dateRelance) return -1;
      return a.dateRelance.localeCompare(b.dateRelance);
    });
  }, [contacts]);

  // Contacts à relancer aujourd'hui (ou en retard)
  const getDueContacts = useCallback((): Contact[] => {
    const today = toLocalDateKey(new Date());
    return contacts.filter(c => c.dateRelance && c.dateRelance <= today);
  }, [contacts]);

  return {
    contacts,
    addContact,
    updateContact,
    removeContact,
    postponeContact,
    addNote,
    planifierRelance,
    sortedContacts,
    getDueContacts,
    loadFromCloud,
  };
}
