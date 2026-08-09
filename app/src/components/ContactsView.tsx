import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Phone, Pencil, Trash2, ShieldAlert, CalendarClock } from 'lucide-react';
import { useContacts, type Contact, type ContactStatut } from '@/hooks/useContacts';

// ============================================
// Mini-carnet de contacts chauds (MOD-14)
// ============================================

interface ContactsViewProps {
  userKey: string;
  // Optionnel : instance du hook déjà créée par App.tsx (pour la sync cloud).
  // Si absente, la vue instancie son propre hook sur la même clé localStorage.
  state?: ReturnType<typeof useContacts>;
}

const STATUTS: { value: ContactStatut; label: string; badge: string; active: string }[] = [
  { value: 'chaud', label: 'Chaud', badge: 'bg-red-50 text-red-700 border-red-200', active: 'border-red-500 bg-red-50 text-red-700' },
  { value: 'tiède', label: 'Tiède', badge: 'bg-orange-50 text-orange-700 border-orange-200', active: 'border-orange-500 bg-orange-50 text-orange-700' },
  { value: 'froid', label: 'Froid', badge: 'bg-blue-50 text-blue-700 border-blue-200', active: 'border-blue-500 bg-blue-50 text-blue-700' },
];

const EMPTY_FORM = {
  nom: '',
  telephone: '',
  contexte: '',
  origine: '',
  dateRelance: '',
  statut: 'chaud' as ContactStatut,
};

function formatRelance(dateRelance: string): { label: string; overdue: boolean } | null {
  if (!dateRelance) return null;
  const today = new Date().toISOString().split('T')[0];
  const label = new Date(`${dateRelance}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return { label, overdue: dateRelance <= today };
}

export function ContactsView({ userKey, state }: ContactsViewProps) {
  const internal = useContacts(userKey);
  const { contacts, addContact, updateContact, removeContact, sortedContacts } = state ?? internal;

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditForm = (contact: Contact) => {
    setEditingId(contact.id);
    setForm({
      nom: contact.nom,
      telephone: contact.telephone,
      contexte: contact.contexte,
      origine: contact.origine,
      dateRelance: contact.dateRelance,
      statut: contact.statut,
    });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!form.nom.trim()) return;
    const data = {
      nom: form.nom.trim(),
      telephone: form.telephone.trim(),
      contexte: form.contexte.trim(),
      origine: form.origine.trim(),
      dateRelance: form.dateRelance,
      statut: form.statut,
    };
    if (editingId) {
      updateContact(editingId, data);
    } else {
      addContact(data);
    }
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const sorted = sortedContacts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            Contacts chauds
          </h2>
          <p className="text-gray-500 mt-1">
            {contacts.length} contact{contacts.length > 1 ? 's' : ''} dans ton carnet
          </p>
        </div>
        {!formOpen && (
          <Button onClick={openAddForm} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        )}
      </div>

      {/* Mention RGPD */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Ces fiches contiennent des données personnelles de prospects : tu es responsable de leur conservation et de leur suppression (cf. recommandations RGPD).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire ajout / édition */}
      {formOpen && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">
              {editingId ? 'Modifier la fiche' : 'Nouvelle fiche contact'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-nom">Nom *</Label>
                <Input
                  id="contact-nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex : Mme Dupont"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-telephone">Téléphone</Label>
                <Input
                  id="contact-telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-contexte">Contexte</Label>
                <Input
                  id="contact-contexte"
                  value={form.contexte}
                  onChange={e => setForm({ ...form, contexte: e.target.value })}
                  placeholder="Ex : veut vendre sa maison avant septembre"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-origine">Origine</Label>
                <Input
                  id="contact-origine"
                  value={form.origine}
                  onChange={e => setForm({ ...form, origine: e.target.value })}
                  placeholder="Ex : porte-à-porte, recommandation…"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-relance">Date de relance</Label>
                <Input
                  id="contact-relance"
                  type="date"
                  value={form.dateRelance}
                  onChange={e => setForm({ ...form, dateRelance: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Statut</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {STATUTS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setForm({ ...form, statut: s.value })}
                      className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                        form.statut === s.value ? s.active : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={submitForm} disabled={!form.nom.trim()} className="bg-red-600 hover:bg-red-700">
                {editingId ? 'Enregistrer les modifications' : 'Créer la fiche'}
              </Button>
              <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des fiches */}
      {sorted.length === 0 && !formOpen ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Aucun contact pour l'instant</h3>
          <p className="text-gray-500 mt-2">Ajoute tes prospects chauds pour ne jamais oublier une relance.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(contact => {
            const statut = STATUTS.find(s => s.value === contact.statut) ?? STATUTS[0];
            const relance = formatRelance(contact.dateRelance);
            return (
              <Card key={contact.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                        {contact.nom}
                        <Badge variant="outline" className={statut.badge}>{statut.label}</Badge>
                      </p>
                      {contact.contexte && (
                        <p className="text-sm text-gray-600 mt-1">{contact.contexte}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                        {contact.telephone && (
                          <a href={`tel:${contact.telephone.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:text-red-600">
                            <Phone className="w-3 h-3" /> {contact.telephone}
                          </a>
                        )}
                        {contact.origine && <span>Origine : {contact.origine}</span>}
                        {relance && (
                          <span className={`flex items-center gap-1 ${relance.overdue ? 'text-red-600 font-semibold' : ''}`}>
                            <CalendarClock className="w-3 h-3" />
                            {relance.overdue ? 'À relancer' : 'Relance'} le {relance.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {confirmDeleteId === contact.id ? (
                        <span className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600">Supprimer ?</span>
                          <button
                            onClick={() => { removeContact(contact.id); setConfirmDeleteId(null); }}
                            className="text-red-600 font-semibold hover:underline"
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-gray-500 hover:underline"
                          >
                            Non
                          </button>
                        </span>
                      ) : (
                        <>
                          <button onClick={() => openEditForm(contact)} className="text-gray-400 hover:text-blue-500 p-2" aria-label="Modifier">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDeleteId(contact.id)} className="text-gray-400 hover:text-red-500 p-2" aria-label="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
