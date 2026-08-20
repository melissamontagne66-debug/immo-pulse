import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Phone, Pencil, Trash2, ShieldAlert, CalendarClock, Download, Search, StickyNote, Mail, MapPin, Cake } from 'lucide-react';
import { useContacts, type Contact, type ContactStatut, type ContactOrigine, type ContactTypeProspect, type ContactOccupancy, type DelaiRelance } from '@/hooks/useContacts';
import { toLocalDateKey } from '@/lib/utils';

// ============================================
// Carnet de contacts enrichi — fiche complète, notes, relances planifiées,
// filtres et export Excel (CSV).
// ============================================

interface ContactsViewProps {
  userKey: string;
  // Optionnel : instance du hook déjà créée par App.tsx (pour la sync cloud).
  state?: ReturnType<typeof useContacts>;
}

const STATUTS: { value: ContactStatut; label: string; labelEs: string; badge: string; active: string }[] = [
  { value: 'chaud', label: 'Chaud', labelEs: 'Caliente', badge: 'bg-red-50 text-red-700 border-red-200', active: 'border-red-500 bg-red-50 text-red-700' },
  { value: 'tiède', label: 'Tiède', labelEs: 'Templado', badge: 'bg-orange-50 text-orange-700 border-orange-200', active: 'border-orange-500 bg-orange-50 text-orange-700' },
  { value: 'froid', label: 'Froid', labelEs: 'Frío', badge: 'bg-blue-50 text-blue-700 border-blue-200', active: 'border-blue-500 bg-blue-50 text-blue-700' },
];

const ORIGINES: { value: ContactOrigine; label: string; labelEs: string }[] = [
  { value: 'pige', label: 'Pige', labelEs: 'Pige' },
  { value: 'porte-a-porte', label: 'Porte-à-porte', labelEs: 'Puerta fría' },
  { value: 'bouche-a-oreille', label: 'Bouche-à-oreille', labelEs: 'Boca a boca' },
  { value: 'apporteur', label: 'Apporteur d\'affaires', labelEs: 'Colaborador de negocios' },
  { value: 'autre', label: 'Autre', labelEs: 'Otro' },
];

const TYPES_PROSPECT: { value: Exclude<ContactTypeProspect, ''>; label: string; labelEs: string }[] = [
  { value: 'acheteur', label: 'Acheteur', labelEs: 'Comprador' },
  { value: 'vendeur', label: 'Vendeur', labelEs: 'Vendedor' },
  { value: 'sans-projet', label: 'Sans projet', labelEs: 'Sin proyecto' },
];

const OCCUPANCY: { value: Exclude<ContactOccupancy, ''>; label: string; labelEs: string }[] = [
  { value: 'proprietaire', label: 'Propriétaire', labelEs: 'Propietario' },
  { value: 'locataire', label: 'Locataire', labelEs: 'Inquilino' },
];

const DELAIS: { value: Exclude<DelaiRelance, ''>; label: string; labelEs: string }[] = [
  { value: '1-semaine', label: '1 semaine', labelEs: '1 semana' },
  { value: '15-jours', label: '15 jours', labelEs: '15 días' },
  { value: '1-mois', label: '1 mois', labelEs: '1 mes' },
  { value: '3-mois', label: '3 mois', labelEs: '3 meses' },
  { value: 'personnalise', label: 'Personnaliser (date exacte)', labelEs: 'Personalizar (fecha exacta)' },
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

function origineLabel(value: ContactOrigine, isEs: boolean): string {
  return ORIGINES.find(o => o.value === value)?.[isEs ? 'labelEs' : 'label'] ?? value;
}

function typeLabel(value: ContactTypeProspect, isEs: boolean): string {
  if (!value) return '';
  return TYPES_PROSPECT.find(t => t.value === value)?.[isEs ? 'labelEs' : 'label'] ?? value;
}

function formatRelance(dateRelance: string, isEs: boolean): { label: string; overdue: boolean } | null {
  if (!dateRelance) return null;
  const today = toLocalDateKey(new Date());
  const label = new Date(`${dateRelance}T12:00:00`).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', { day: 'numeric', month: 'short' });
  return { label, overdue: dateRelance <= today };
}

// Export CSV compatible Excel (BOM UTF-8 + séparateur « ; »)
function exportCsv(contacts: Contact[]) {
  const headers = ['Nom', 'Prénom', 'Téléphone', 'Email', 'Origine', 'Type de prospect', 'Propriétaire/Locataire', 'Statut', 'Adresse', 'Code postal', 'Ville', 'Quartier/Secteur', 'Contexte', 'Dernière relance', 'Prochaine relance', 'Anniversaire', 'Notes'];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = contacts.map(c => [
    c.nom, c.prenom, c.telephone, c.email,
    origineLabel(c.origine, false), typeLabel(c.typeProspect, false),
    OCCUPANCY.find(o => o.value === c.occupancy)?.label ?? '',
    STATUTS.find(s => s.value === c.statut)?.label ?? c.statut,
    c.adresse, c.codePostal, c.ville, c.quartier, c.contexte,
    c.dateDerniereRelance, c.dateRelance, c.anniversaire,
    (c.notes ?? []).map(n => `${n.date} : ${n.texte}`).join(' | '),
  ].map(v => escape(String(v ?? ''))).join(';'));
  const csv = '\uFEFF' + [headers.map(escape).join(';'), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prospects-immo-pulse-${toLocalDateKey(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface FormState {
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
  anniversaire: string;
  statut: ContactStatut;
  dateDerniereRelance: string;
  delaiRelance: DelaiRelance;
  dateRelanceExacte: string;
}

const EMPTY_FORM: FormState = {
  nom: '', prenom: '', telephone: '', email: '', contexte: '',
  origine: 'autre', typeProspect: '', occupancy: '',
  adresse: '', codePostal: '', ville: '', quartier: '', anniversaire: '',
  statut: 'chaud', dateDerniereRelance: '', delaiRelance: '', dateRelanceExacte: '',
};

function computeDateRelance(delai: DelaiRelance, dateExacte: string): string {
  if (delai === 'personnalise') return dateExacte;
  const jours = delai === '1-semaine' ? 7 : delai === '15-jours' ? 15 : delai === '1-mois' ? 30 : delai === '3-mois' ? 90 : 0;
  if (jours === 0) return '';
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return toLocalDateKey(d);
}

export function ContactsView({ userKey, state }: ContactsViewProps) {
  const internal = useContacts(userKey);
  const { contacts, addContact, updateContact, removeContact, sortedContacts, addNote, planifierRelance } = state ?? internal;
  const isEs = readIsEs(userKey);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtres
  const [search, setSearch] = useState('');
  const [filterOrigine, setFilterOrigine] = useState<ContactOrigine | ''>('');
  const [filterStatut, setFilterStatut] = useState<ContactStatut | ''>('');
  const [filterType, setFilterType] = useState<ContactTypeProspect | ''>('');

  // Notes par fiche (texte en cours de saisie)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replanId, setReplanId] = useState<string | null>(null);
  const [replanDelai, setReplanDelai] = useState<DelaiRelance>('1-semaine');
  const [replanDate, setReplanDate] = useState('');

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditForm = (contact: Contact) => {
    setEditingId(contact.id);
    setForm({
      nom: contact.nom,
      prenom: contact.prenom,
      telephone: contact.telephone,
      email: contact.email,
      contexte: contact.contexte,
      origine: contact.origine,
      typeProspect: contact.typeProspect,
      occupancy: contact.occupancy,
      adresse: contact.adresse,
      codePostal: contact.codePostal,
      ville: contact.ville,
      quartier: contact.quartier,
      anniversaire: contact.anniversaire,
      statut: contact.statut,
      dateDerniereRelance: contact.dateDerniereRelance,
      delaiRelance: contact.dateRelance ? 'personnalise' : '',
      dateRelanceExacte: contact.dateRelance,
    });
    setFormOpen(true);
  };

  const submitForm = () => {
    if (!form.nom.trim()) return;
    const data = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      telephone: form.telephone.trim(),
      email: form.email.trim(),
      contexte: form.contexte.trim(),
      origine: form.origine,
      typeProspect: form.typeProspect,
      occupancy: form.occupancy,
      adresse: form.adresse.trim(),
      codePostal: form.codePostal.trim(),
      ville: form.ville.trim(),
      quartier: form.quartier.trim(),
      anniversaire: form.anniversaire,
      statut: form.statut,
      dateDerniereRelance: form.dateDerniereRelance,
      dateRelance: computeDateRelance(form.delaiRelance, form.dateRelanceExacte),
    };
    if (editingId) {
      updateContact(editingId, data);
    } else {
      addContact({ ...data, notes: [] });
    }
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sortedContacts().filter(c => {
      if (q && ![c.nom, c.prenom, c.telephone, c.ville, c.email].some(v => (v ?? '').toLowerCase().includes(q))) return false;
      if (filterOrigine && c.origine !== filterOrigine) return false;
      if (filterStatut && c.statut !== filterStatut) return false;
      if (filterType && c.typeProspect !== filterType) return false;
      return true;
    });
  }, [sortedContacts, search, filterOrigine, filterStatut, filterType]);

  const hasFilters = search.trim() !== '' || filterOrigine !== '' || filterStatut !== '' || filterType !== '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
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
        <div className="flex gap-2">
          {contacts.length > 0 && (
            <Button variant="outline" onClick={() => exportCsv(filtered)}>
              <Download className="w-4 h-4 mr-2" />
              {isEs ? 'Exportar (Excel)' : 'Exporter (Excel)'}
            </Button>
          )}
          {!formOpen && (
            <Button onClick={openAddForm} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" /> {isEs ? 'Añadir' : 'Ajouter'}
            </Button>
          )}
        </div>
      </div>

      {/* Mention RGPD */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs text-amber-700">
                {isEs
                  ? 'Estas fichas contienen datos personales de clientes potenciales: usted es responsable de su conservación y de su eliminación (cf. recomendaciones RGPD).'
                  : 'Ces fiches contiennent des données personnelles de prospects : tu es responsable de leur conservation et de leur suppression (cf. recommandations RGPD).'}
              </p>
              <p className="text-xs text-amber-800 font-medium">
                {isEs
                  ? '🔁 En cuanto un cliente potencial tiene un proyecto formalizado o una cita de estimación, transfiere su ficha a la intranet de tu red. Las fichas sin interacción durante 90 días se eliminan automáticamente.'
                  : '🔁 Dès qu\'un prospect a un projet formalisé ou un RDV d\'estimation, transfère sa fiche sur l\'intranet de ton réseau. Les fiches sans interaction depuis 90 jours sont supprimées automatiquement.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      {contacts.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isEs ? 'Buscar (nombre, teléfono, ciudad, email…)' : 'Rechercher (nom, téléphone, ville, email…)'}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={filterOrigine}
                onChange={e => setFilterOrigine(e.target.value as ContactOrigine | '')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
                aria-label={isEs ? 'Filtrar por origen' : 'Filtrer par origine'}
              >
                <option value="">{isEs ? 'Origen: todos' : 'Origine : toutes'}</option>
                {ORIGINES.map(o => <option key={o.value} value={o.value}>{isEs ? o.labelEs : o.label}</option>)}
              </select>
              <select
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value as ContactStatut | '')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
                aria-label={isEs ? 'Filtrar por estado' : 'Filtrer par statut'}
              >
                <option value="">{isEs ? 'Estado: todos' : 'Statut : tous'}</option>
                {STATUTS.map(s => <option key={s.value} value={s.value}>{isEs ? s.labelEs : s.label}</option>)}
              </select>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as ContactTypeProspect | '')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
                aria-label={isEs ? 'Filtrar por tipo' : 'Filtrer par type'}
              >
                <option value="">{isEs ? 'Tipo: todos' : 'Type : tous'}</option>
                {TYPES_PROSPECT.map(t => <option key={t.value} value={t.value}>{isEs ? t.labelEs : t.label}</option>)}
              </select>
            </div>
            {hasFilters && (
              <p className="text-xs text-gray-500">
                {isEs
                  ? `${filtered.length} resultado(s) — la exportación Excel respeta estos filtros.`
                  : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''} — l'export Excel respecte ces filtres.`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formulaire ajout / édition */}
      {formOpen && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">
              {editingId
                ? (isEs ? 'Modificar la ficha' : 'Modifier la fiche')
                : (isEs ? 'Nueva ficha de contacto' : 'Nouvelle fiche contact')}
            </h3>

            {/* Identité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-nom">{isEs ? 'Apellido *' : 'Nom *'}</Label>
                <Input id="contact-nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder={isEs ? 'Ej.: García' : 'Ex : Dupont'} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-prenom">{isEs ? 'Nombre' : 'Prénom'}</Label>
                <Input id="contact-prenom" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder={isEs ? 'Ej.: María' : 'Ex : Marie'} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-telephone">{isEs ? 'Teléfono' : 'Téléphone'}</Label>
                <Input id="contact-telephone" type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder={isEs ? '612 34 56 78' : '06 12 34 56 78'} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="exemple@email.com" className="mt-1" />
              </div>
            </div>

            {/* Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact-origine">{isEs ? 'Origen' : 'Origine'}</Label>
                <select id="contact-origine" value={form.origine} onChange={e => setForm({ ...form, origine: e.target.value as ContactOrigine })} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  {ORIGINES.map(o => <option key={o.value} value={o.value}>{isEs ? o.labelEs : o.label}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="contact-type">{isEs ? 'Tipo de cliente potencial' : 'Type de prospect'}</Label>
                <select id="contact-type" value={form.typeProspect} onChange={e => setForm({ ...form, typeProspect: e.target.value as ContactTypeProspect })} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  <option value="">{isEs ? '—' : '—'}</option>
                  {TYPES_PROSPECT.map(t => <option key={t.value} value={t.value}>{isEs ? t.labelEs : t.label}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="contact-occupancy">{isEs ? 'Situación' : 'Propriétaire ou locataire'}</Label>
                <select id="contact-occupancy" value={form.occupancy} onChange={e => setForm({ ...form, occupancy: e.target.value as ContactOccupancy })} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  <option value="">—</option>
                  {OCCUPANCY.map(o => <option key={o.value} value={o.value}>{isEs ? o.labelEs : o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="contact-adresse">{isEs ? 'Dirección' : 'Adresse'}</Label>
                <Input id="contact-adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder={isEs ? 'Ej.: 12 calle de los Lilas' : 'Ex : 12 rue des Lilas'} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-cp">{isEs ? 'Código postal' : 'Code postal'}</Label>
                <Input id="contact-cp" value={form.codePostal} onChange={e => setForm({ ...form, codePostal: e.target.value })} placeholder="75000" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-ville">{isEs ? 'Ciudad' : 'Ville'}</Label>
                <Input id="contact-ville" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder={isEs ? 'Ej.: Lyon' : 'Ex : Lyon'} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-quartier">{isEs ? 'Barrio / sector' : 'Quartier / secteur'}</Label>
                <Input id="contact-quartier" value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} placeholder={isEs ? 'Ej.: centro' : 'Ex : Centre-ville'} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-anniv">{isEs ? 'Cumpleaños' : 'Date d\'anniversaire'}</Label>
                <Input id="contact-anniv" type="date" value={form.anniversaire} onChange={e => setForm({ ...form, anniversaire: e.target.value })} className="mt-1" />
              </div>
            </div>

            {/* Contexte + suivi */}
            <div>
              <Label htmlFor="contact-contexte">{isEs ? 'Contexto' : 'Contexte'}</Label>
              <Input id="contact-contexte" value={form.contexte} onChange={e => setForm({ ...form, contexte: e.target.value })} placeholder={isEs ? 'Ej.: quiere vender su casa antes de septiembre' : 'Ex : veut vendre sa maison avant septembre'} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-derniere-relance">{isEs ? 'Fecha del último seguimiento' : 'Date de dernière relance'}</Label>
                <Input id="contact-derniere-relance" type="date" value={form.dateDerniereRelance} onChange={e => setForm({ ...form, dateDerniereRelance: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-delai">{isEs ? 'Próximo seguimiento en…' : 'À relancer sous…'}</Label>
                <select id="contact-delai" value={form.delaiRelance} onChange={e => setForm({ ...form, delaiRelance: e.target.value as DelaiRelance })} className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  <option value="">{isEs ? 'Sin seguimiento previsto' : 'Pas de relance prévue'}</option>
                  {DELAIS.map(d => <option key={d.value} value={d.value}>{isEs ? d.labelEs : d.label}</option>)}
                </select>
              </div>
            </div>
            {form.delaiRelance === 'personnalise' && (
              <div>
                <Label htmlFor="contact-relance-exacte">{isEs ? 'Fecha exacta de seguimiento' : 'Date exacte de relance'}</Label>
                <Input id="contact-relance-exacte" type="date" value={form.dateRelanceExacte} onChange={e => setForm({ ...form, dateRelanceExacte: e.target.value })} className="mt-1" />
              </div>
            )}
            {form.delaiRelance && form.delaiRelance !== 'personnalise' && (
              <p className="text-xs text-gray-500">
                {isEs
                  ? `Se creará un recordatorio para el ${new Date(`${computeDateRelance(form.delaiRelance, '')}T12:00:00`).toLocaleDateString('es-ES')}.`
                  : `Un rappel sera créé pour le ${new Date(`${computeDateRelance(form.delaiRelance, '')}T12:00:00`).toLocaleDateString('fr-FR')}.`}
              </p>
            )}

            {/* Statut */}
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
      {filtered.length === 0 && !formOpen ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          {hasFilters ? (
            <p className="text-gray-500">{isEs ? 'Ningún contacto coincide con estos filtros.' : 'Aucun contact ne correspond à ces filtres.'}</p>
          ) : (
            <>
              <p className="text-gray-500">{isEs ? 'Su archivo empieza aquí: añada su primer contacto caliente.' : 'Ton fichier démarre ici : ajoute ton premier contact chaud.'}</p>
              <Button onClick={openAddForm} className="mt-4 bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" /> {isEs ? 'Añadir un contacto' : 'Ajouter un contact'}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(contact => {
            const statut = STATUTS.find(s => s.value === contact.statut) ?? STATUTS[0];
            const relance = formatRelance(contact.dateRelance, isEs);
            const expanded = expandedId === contact.id;
            return (
              <Card key={contact.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button className="flex-1 min-w-0 text-left" onClick={() => setExpandedId(expanded ? null : contact.id)}>
                      <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                        {[contact.prenom, contact.nom].filter(Boolean).join(' ') || contact.nom}
                        <Badge variant="outline" className={statut.badge}>{isEs ? statut.labelEs : statut.label}</Badge>
                        {contact.typeProspect && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">{typeLabel(contact.typeProspect, isEs)}</Badge>
                        )}
                      </p>
                      {contact.contexte && (
                        <p className="text-sm text-gray-600 mt-1">{contact.contexte}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
                        {contact.telephone && (
                          <a href={`tel:${contact.telephone.replace(/\s/g, '')}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 hover:text-red-600">
                            <Phone className="w-3 h-3" /> {contact.telephone}
                          </a>
                        )}
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 hover:text-red-600">
                            <Mail className="w-3 h-3" /> {contact.email}
                          </a>
                        )}
                        <span>{isEs ? 'Origen' : 'Origine'} : {origineLabel(contact.origine, isEs)}</span>
                        {(contact.ville || contact.quartier) && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {[contact.quartier, contact.ville].filter(Boolean).join(', ')}</span>
                        )}
                        {relance && (
                          <span className={`flex items-center gap-1 ${relance.overdue ? 'text-red-600 font-semibold' : ''}`}>
                            <CalendarClock className="w-3 h-3" />
                            {isEs
                              ? `${relance.overdue ? 'Seguimiento pendiente' : 'Seguimiento'} el ${relance.label}`
                              : `${relance.overdue ? 'À relancer' : 'Relance'} le ${relance.label}`}
                          </span>
                        )}
                        {contact.anniversaire && (
                          <span className="flex items-center gap-1"><Cake className="w-3 h-3" /> {new Date(`${contact.anniversaire}T12:00:00`).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', { day: 'numeric', month: 'short' })}</span>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {confirmDeleteId === contact.id ? (
                        <span className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600">{isEs ? '¿Eliminar?' : 'Supprimer ?'}</span>
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

                  {/* Zone dépliée : notes + replanification */}
                  {expanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                      {/* Notes */}
                      <div>
                        <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-2">
                          <StickyNote className="w-3.5 h-3.5 text-gray-500" />
                          {isEs ? 'Notas' : 'Notes'}
                        </p>
                        {(contact.notes ?? []).length > 0 && (
                          <div className="space-y-1.5 mb-2">
                            {(contact.notes ?? []).map(n => (
                              <p key={n.id} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                <span className="text-gray-400">{new Date(`${n.date}T12:00:00`).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR')} — </span>
                                {n.texte}
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            value={noteDrafts[contact.id] ?? ''}
                            onChange={e => setNoteDrafts(prev => ({ ...prev, [contact.id]: e.target.value }))}
                            placeholder={isEs ? 'Añadir una nota…' : 'Ajouter une note…'}
                            className="text-sm"
                            onKeyDown={e => {
                              if (e.key === 'Enter' && (noteDrafts[contact.id] ?? '').trim()) {
                                addNote(contact.id, noteDrafts[contact.id] ?? '');
                                setNoteDrafts(prev => ({ ...prev, [contact.id]: '' }));
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!(noteDrafts[contact.id] ?? '').trim()}
                            onClick={() => {
                              addNote(contact.id, noteDrafts[contact.id] ?? '');
                              setNoteDrafts(prev => ({ ...prev, [contact.id]: '' }));
                            }}
                          >
                            {isEs ? 'Añadir' : 'Ajouter'}
                          </Button>
                        </div>
                      </div>

                      {/* Replanifier une relance */}
                      <div>
                        {replanId === contact.id ? (
                          <div className="flex items-end gap-2 flex-wrap">
                            <div>
                              <Label className="text-xs">{isEs ? 'Próximo seguimiento en…' : 'À relancer sous…'}</Label>
                              <select
                                value={replanDelai}
                                onChange={e => setReplanDelai(e.target.value as DelaiRelance)}
                                className="mt-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                              >
                                {DELAIS.map(d => <option key={d.value} value={d.value}>{isEs ? d.labelEs : d.label}</option>)}
                              </select>
                            </div>
                            {replanDelai === 'personnalise' && (
                              <div>
                                <Label className="text-xs">{isEs ? 'Fecha exacta' : 'Date exacte'}</Label>
                                <Input type="date" value={replanDate} onChange={e => setReplanDate(e.target.value)} className="mt-1" />
                              </div>
                            )}
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                planifierRelance(contact.id, replanDelai, replanDate || undefined);
                                // Une relance PLANIFIÉE ne remet PAS le compteur d'inactivité à zéro
                                // (dateDerniereRelance n'est mise à jour que sur une interaction réelle).
                                setReplanId(null);
                              }}
                            >
                              {isEs ? 'Planificar' : 'Planifier'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setReplanId(null)}>
                              {isEs ? 'Cancelar' : 'Annuler'}
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setReplanId(contact.id); setReplanDelai('1-semaine'); setReplanDate(''); }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            {isEs ? 'Planificar un nuevo seguimiento' : 'Planifier une nouvelle relance'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
