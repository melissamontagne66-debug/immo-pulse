import { useState, useCallback, useRef, useEffect } from 'react';
import { apiSaveContact, apiDeleteContact, isCloudEnabled } from '@/services/api';

// ============================================
// Mini-carnet de contacts chauds (MOD-14)
// localStorage : iad-coach-contacts-{userKey}
// Sync API : POST/DELETE /api/contacts + GET /api/sync
// ============================================

export type ContactStatut = 'chaud' | 'tiède' | 'froid';

export interface Contact {
  id: string;
  nom: string;
  telephone: string;
  contexte: string;
  origine: string;
  dateRelance: string; // ISO YYYY-MM-DD ('' si pas de relance prévue)
  createdAt: string;
  statut: ContactStatut;
}

const STORAGE_PREFIX = 'iad-coach-contacts';

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

function loadContacts(userKey: string): Contact[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
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

// Mapping API (EN) → front (FR)
function fromApiContact(raw: any): Contact {
  return {
    id: raw.id,
    nom: raw.name || '',
    telephone: raw.phone || '',
    contexte: raw.context || '',
    origine: raw.origin || '',
    dateRelance: raw.followUpDate || '',
    createdAt: raw.createdAt || '',
    statut: (raw.status === 'tiède' || raw.status === 'froid') ? raw.status : 'chaud',
  };
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
  const [contacts, setContacts] = useState<Contact[]>(() => loadContacts(userKey));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      setContacts(loadContacts(userKey));
    }
  }, [userKey]);

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
    sortedContacts,
    getDueContacts,
    loadFromCloud,
  };
}
