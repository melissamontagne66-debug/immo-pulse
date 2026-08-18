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

function formatDateHeure(dateHeure: string): string {
  const [datePart, timePart] = dateHeure.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const dateLabel = new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  return timePart ? `${dateLabel} à ${timePart}` : dateLabel;
}

function formatHeure(dateHeure: string): string {
  return dateHeure.split('T')[1] || '';
}

export function RdvList() {
  const { addRdv, deleteRdv, getRdvDuJour, getRdvAVenir } = useRdv();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ titre: '', date: '', heure: '', lieu: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
            📅 Mes RDV à venir
          </p>
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          )}
        </div>

        {/* RDV du jour mis en avant */}
        {rdvDuJour.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 space-y-0.5">
            {rdvDuJour.map(r => (
              <p key={r.id} className="text-sm font-medium text-red-800">
                Aujourd'hui&nbsp;: {r.titre}{formatHeure(r.dateHeure) && <> — {formatHeure(r.dateHeure)}</>}
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
              placeholder="Titre * (ex : R1 Mme Dupont)"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                aria-label="Date *"
              />
              <Input
                type="time"
                value={form.heure}
                onChange={e => setForm({ ...form, heure: e.target.value })}
                aria-label="Heure"
              />
            </div>
            <Input
              value={form.lieu}
              onChange={e => setForm({ ...form, lieu: e.target.value })}
              placeholder="Lieu (optionnel)"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={submitForm}
                disabled={!form.titre.trim() || !form.date}
                className="bg-red-600 hover:bg-red-700"
              >
                Enregistrer
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFormOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Liste des RDV à venir */}
        {aVenir.length === 0 && !formOpen ? (
          <p className="text-sm text-gray-400">Aucun RDV planifié — ajoute ton prochain rendez-vous pour le garder sous les yeux.</p>
        ) : (
          <div className="space-y-1.5">
            {aVenir.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.titre}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateHeure(r.dateHeure)}
                    {r.lieu && (
                      <span className="inline-flex items-center gap-0.5 ml-2">
                        <MapPin className="w-3 h-3" /> {r.lieu}
                      </span>
                    )}
                  </p>
                </div>
                {confirmDeleteId === r.id ? (
                  <span className="flex items-center gap-2 text-xs flex-shrink-0">
                    <span className="text-gray-600">Supprimer&nbsp;?</span>
                    <button
                      onClick={() => { deleteRdv(r.id); setConfirmDeleteId(null); }}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Oui
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:underline">
                      Non
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                    aria-label="Supprimer"
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
