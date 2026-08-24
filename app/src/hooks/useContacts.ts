import { useState, useCallback, useRef, useEffect } from 'react';
import { apiSaveContact, apiDeleteContact, isCloudEnabled } from '@/services/api';

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

function purgeExpired(userKey: string, contacts: Contact[]): Contact[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PURGE_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const expired = contacts.filter(c => {
    const last = lastInteractionKey(c);
    return last && last < cutoffKey;
  });
  if (expired.length === 0) return contacts;
  expired.forEach(c => deleteFromCloud(c.id));
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
  return contacts.filter(c => c.anniversaire && c.anniversaire.slice(5) === jourMois);
}

function saveContacts(userKey: string, contacts: Contact[]) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(contacts));
}

// Mapping front (FR) → API (EN, calqué sur les colonnes SQL)
function toApiContact(contact: Contact) {
  return {
    id: contact.id,
    name: contact.nom,
    phone: contact.telephone,
    context: contact.contexte,
    origin: contact.origine,
    followUpDate: contact.dateRelance || null,
    status: contact.statut,
    createdAt: contact.createdAt,
  };
}

// Mapping API (EN) → front (FR) — avec migration douce vers le modèle enrichi
function fromApiContact(raw: any): Contact {
  return migrateContact({
    id: raw.id,
    nom: raw.name || '',
    telephone: raw.phone || '',
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

function deleteFromCloud(id: string) {
  if (!isCloudEnabled()) return;
  apiDeleteContact(id).catch(() => { /* silencieux : local déjà à jour */ });
}

export function useContacts(userKey: string) {
  const [contacts, setContacts] = useState<Contact[]>(() => purgeExpired(userKey, loadContacts(userKey)));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      setContacts(purgeExpired(userKey, loadContacts(userKey)));
    }
  }, [userKey]);

  // Purge RGPD à l'ouverture (une fois par session)
  useEffect(() => {
    setContacts(prev => purgeExpired(loadedKey.current, prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inject cloud data (called from App.tsx after apiSyncLoad)
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
    deleteFromCloud(id);
  }, []);

  // Repousse la relance au lendemain
  const postponeContact = useCallback((id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateContact(id, { dateRelance: tomorrow.toISOString().split('T')[0] });
  }, [updateContact]);

  // Ajoute une note à l'historique du prospect
  const addNote = useCallback((id: string, texte: string) => {
    const trimmed = texte.trim();
    if (!trimmed) return;
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        const note = { id: `note-${Date.now()}`, date: new Date().toISOString().split('T')[0], texte: trimmed };
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
    updateContact(id, { dateRelance: d.toISOString().split('T')[0] });
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
    const today = new Date().toISOString().split('T')[0];
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
