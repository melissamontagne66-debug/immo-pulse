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

const STATUTS: { value: ContactStatut; label: string; labelEs: string; badge: string; active: string }[] = [
  { value: 'chaud', label: 'Chaud', labelEs: 'Caliente', badge: 'bg-red-50 text-red-700 border-red-200', active: 'border-red-500 bg-red-50 text-red-700' },
  { value: 'tiède', label: 'Tiède', labelEs: 'Templado', badge: 'bg-orange-50 text-orange-700 border-orange-200', active: 'border-orange-500 bg-orange-50 text-orange-700' },
  { value: 'froid', label: 'Froid', labelEs: 'Frío', badge: 'bg-blue-50 text-blue-700 border-blue-200', active: 'border-blue-500 bg-blue-50 text-blue-700' },
];

// Langue lue depuis le profil local (iad-coach-profile-{userKey})
function readIsEs(userKey: string): boolean {
  try {
    const key = userKey ? `iad-coach-profile-${userKey}` : 'iad-coach-profile';
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored)?.language === 'es';
  } catch { /* ignore */ }
  return false;
}

const EMPTY_FORM = {
  nom: '',
  telephone: '',
  contexte: '',
  origine: '',
  dateRelance: '',
  statut: 'chaud' as ContactStatut,
};

function formatRelance(dateRelance: string, isEs: boolean): { label: string; overdue: boolean } | null {
  if (!dateRelance) return null;
  const today = new Date().toISOString().split('T')[0];
  const label = new Date(`${dateRelance}T12:00:00`).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', { day: 'numeric', month: 'short' });
  return { label, overdue: dateRelance <= today };
}

export function ContactsView({ userKey, state }: ContactsViewProps) {
  const internal = useContacts(userKey);
  const { contacts, addContact, updateContact, removeContact, sortedContacts } = state ?? internal;
  const isEs = readIsEs(userKey);

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
            {isEs ? 'Contactos calientes' : 'Contacts chauds'}
          </h2>
          <p className="text-gray-500 mt-1">
            {isEs
              ? `${contacts.length} contacto${contacts.length > 1 ? 's' : ''} en su agenda`
              : `${contacts.length} contact${contacts.length > 1 ? 's' : ''} dans ton carnet`}
          </p>
        </div>
        {!formOpen && (
          <Button onClick={openAddForm} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" /> {isEs ? 'Añadir' : 'Ajouter'}
          </Button>
        )}
      </div>

      {/* Mention RGPD */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              {isEs
                ? 'Estas fichas contienen datos personales de clientes potenciales: usted es responsable de su conservación y de su eliminación (cf. recomendaciones RGPD).'
                : 'Ces fiches contiennent des données personnelles de prospects : tu es responsable de leur conservation et de leur suppression (cf. recommandations RGPD).'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire ajout / édition */}
      {formOpen && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">
              {editingId
                ? (isEs ? 'Modificar la ficha' : 'Modifier la fiche')
                : (isEs ? 'Nueva ficha de contacto' : 'Nouvelle fiche contact')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-nom">{isEs ? 'Nombre *' : 'Nom *'}</Label>
                <Input
                  id="contact-nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  placeholder={isEs ? 'Ej.: Sra. García' : 'Ex : Mme Dupont'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-telephone">{isEs ? 'Teléfono' : 'Téléphone'}</Label>
                <Input
                  id="contact-telephone"
                  type="tel"
                  value={form.telephone}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                  placeholder={isEs ? '612 34 56 78' : '06 12 34 56 78'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-contexte">{isEs ? 'Contexto' : 'Contexte'}</Label>
                <Input
                  id="contact-contexte"
                  value={form.contexte}
                  onChange={e => setForm({ ...form, contexte: e.target.value })}
                  placeholder={isEs ? 'Ej.: quiere vender su casa antes de septiembre' : 'Ex : veut vendre sa maison avant septembre'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-origine">{isEs ? 'Origen' : 'Origine'}</Label>
                <Input
                  id="contact-origine"
                  value={form.origine}
                  onChange={e => setForm({ ...form, origine: e.target.value })}
                  placeholder={isEs ? 'Ej.: puerta fría, recomendación…' : 'Ex : porte-à-porte, recommandation…'}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-relance">{isEs ? 'Fecha de seguimiento' : 'Date de relance'}</Label>
                <Input
                  id="contact-relance"
                  type="date"
                  value={form.dateRelance}
                  onChange={e => setForm({ ...form, dateRelance: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{isEs ? 'Estado' : 'Statut'}</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {STATUTS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setForm({ ...form, statut: s.value })}
                      className={`p-2 rounded-lg border text-sm font-semibold transition-all ${
                        form.statut === s.value ? s.active : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      {isEs ? s.labelEs : s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={submitForm} disabled={!form.nom.trim()} className="bg-red-600 hover:bg-red-700">
                {editingId
                  ? (isEs ? 'Guardar los cambios' : 'Enregistrer les modifications')
                  : (isEs ? 'Crear la ficha' : 'Créer la fiche')}
              </Button>
              <Button variant="outline" onClick={() => { setFormOpen(false); setEditingId(null); }}>
                {isEs ? 'Cancelar' : 'Annuler'}
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
          <p className="text-gray-500">{isEs ? 'Su archivo empieza aquí: añada su primer contacto caliente.' : 'Ton fichier démarre ici : ajoute ton premier contact chaud.'}</p>
          <Button onClick={openAddForm} className="mt-4 bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" /> {isEs ? 'Añadir un contacto' : 'Ajouter un contact'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(contact => {
            const statut = STATUTS.find(s => s.value === contact.statut) ?? STATUTS[0];
            const relance = formatRelance(contact.dateRelance, isEs);
            return (
              <Card key={contact.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                        {contact.nom}
                        <Badge variant="outline" className={statut.badge}>{isEs ? statut.labelEs : statut.label}</Badge>
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
                        {contact.origine && <span>{isEs ? 'Origen' : 'Origine'} : {contact.origine}</span>}
                        {relance && (
                          <span className={`flex items-center gap-1 ${relance.overdue ? 'text-red-600 font-semibold' : ''}`}>
                            <CalendarClock className="w-3 h-3" />
                            {isEs
                              ? `${relance.overdue ? 'Seguimiento pendiente' : 'Seguimiento'} el ${relance.label}`
                              : `${relance.overdue ? 'À relancer' : 'Relance'} le ${relance.label}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {confirmDeleteId === contact.id ? (
                        <span className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600">{isEs ? '¿Eliminar?' : 'Supprimer ?'}</span>
                          <button
                            onClick={() => { removeContact(contact.id); setConfirmDeleteId(null); }}
                            className="text-red-600 font-semibold hover:underline"
                          >
                            {isEs ? 'Sí' : 'Oui'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-gray-500 hover:underline"
                          >
                            {isEs ? 'No' : 'Non'}
                          </button>
                        </span>
                      ) : (
                        <>
                          <button onClick={() => openEditForm(contact)} className="text-gray-400 hover:text-blue-500 p-2" aria-label={isEs ? 'Modificar' : 'Modifier'}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDeleteId(contact.id)} className="text-gray-400 hover:text-red-500 p-2" aria-label={isEs ? 'Eliminar' : 'Supprimer'}>
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
