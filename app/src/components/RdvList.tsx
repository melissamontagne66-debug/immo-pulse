import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, Plus, MapPin, Trash2 } from 'lucide-react';
import { useRdv, type Rdv } from '@/hooks/useRdv';

// ============================================
// Bloc « 📅 Mes RDV à venir » — mini-agenda du dashboard.
// Version simple : liste + formulaire inline, pas de vue calendrier.
// ============================================

// Langue lue depuis le profil local (iad-coach-profile-{email}) via la session —
// le composant ne reçoit pas `profile` en props (même pattern que
// readAgentInfo dans VisitReportWriter).
function readIsEs(): boolean {
  try {
    const sessionRaw = localStorage.getItem('iad-coach-session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const email = session?.email;
    if (!email) return false;
    const profileRaw = localStorage.getItem(`iad-coach-profile-${email}`);
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    return profile?.language === 'es';
  } catch {
    return false;
  }
}

function formatDateHeure(dateHeure: string, isEs: boolean): string {
  const [datePart, timePart] = dateHeure.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const dateLabel = new Date(y, (m || 1) - 1, d || 1).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  return timePart ? `${dateLabel} ${isEs ? 'a las' : 'à'} ${timePart}` : dateLabel;
}

function formatHeure(dateHeure: string): string {
  return dateHeure.split('T')[1] || '';
}

export function RdvList() {
  const { addRdv, deleteRdv, getRdvDuJour, getRdvAVenir } = useRdv();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ titre: '', date: '', heure: '', lieu: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isEs = readIsEs();

  const rdvDuJour = getRdvDuJour();
  const aVenir = getRdvAVenir();

  const submitForm = () => {
    if (!form.titre.trim() || !form.date) return;
    const rdv: Omit<Rdv, 'id'> = {
      titre: form.titre.trim(),
      dateHeure: form.heure ? `${form.date}T${form.heure}` : `${form.date}T09:00`,
      lieu: form.lieu.trim(),
    };
    addRdv(rdv);
    setForm({ titre: '', date: '', heure: '', lieu: '' });
    setFormOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-red-600" />
            📅 {isEs ? 'Mis próximas citas' : 'Mes RDV à venir'}
          </p>
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <Plus className="w-3.5 h-3.5" /> {isEs ? 'Añadir' : 'Ajouter'}
            </button>
          )}
        </div>

        {/* RDV du jour mis en avant */}
        {rdvDuJour.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 space-y-0.5">
            {rdvDuJour.map(r => (
              <p key={r.id} className="text-sm font-medium text-red-800">
                {isEs ? <>Hoy: {r.titre}</> : <>Aujourd'hui&nbsp;: {r.titre}</>}{formatHeure(r.dateHeure) && <> — {formatHeure(r.dateHeure)}</>}
                {r.lieu && <span className="font-normal text-red-600"> · {r.lieu}</span>}
              </p>
            ))}
          </div>
        )}

        {/* Formulaire inline */}
        {formOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <Input
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              placeholder={isEs ? 'Título * (ej.: R1 Sra. García)' : 'Titre * (ex : R1 Mme Dupont)'}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                aria-label={isEs ? 'Fecha *' : 'Date *'}
              />
              <Input
                type="time"
                value={form.heure}
                onChange={e => setForm({ ...form, heure: e.target.value })}
                aria-label={isEs ? 'Hora' : 'Heure'}
              />
            </div>
            <Input
              value={form.lieu}
              onChange={e => setForm({ ...form, lieu: e.target.value })}
              placeholder={isEs ? 'Lugar (opcional)' : 'Lieu (optionnel)'}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={submitForm}
                disabled={!form.titre.trim() || !form.date}
                className="bg-red-600 hover:bg-red-700"
              >
                {isEs ? 'Guardar' : 'Enregistrer'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFormOpen(false)}>
                {isEs ? 'Cancelar' : 'Annuler'}
              </Button>
            </div>
          </div>
        )}

        {/* Liste des RDV à venir */}
        {aVenir.length === 0 && !formOpen ? (
          <p className="text-sm text-gray-400">{isEs
            ? 'Ninguna cita programada — añadir mi próxima cita para tenerla siempre a la vista.'
            : 'Aucun RDV planifié — ajouter mon prochain rendez-vous pour le garder sous les yeux.'}</p>
        ) : (
          <div className="space-y-1.5">
            {aVenir.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.titre}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateHeure(r.dateHeure, isEs)}
                    {r.lieu && (
                      <span className="inline-flex items-center gap-0.5 ml-2">
                        <MapPin className="w-3 h-3" /> {r.lieu}
                      </span>
                    )}
                  </p>
                </div>
                {confirmDeleteId === r.id ? (
                  <span className="flex items-center gap-2 text-xs flex-shrink-0">
                    <span className="text-gray-600">{isEs ? '¿Eliminar?' : 'Supprimer\u00a0?'}</span>
                    <button
                      onClick={() => { deleteRdv(r.id); setConfirmDeleteId(null); }}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      {isEs ? 'Sí' : 'Oui'}
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:underline">
                      {isEs ? 'No' : 'Non'}
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                    aria-label={isEs ? 'Eliminar' : 'Supprimer'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
