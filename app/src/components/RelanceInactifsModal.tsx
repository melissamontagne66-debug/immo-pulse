import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageSquare, StickyNote, X, ArrowRight } from 'lucide-react';
import type { ContactInactif, useContacts } from '@/hooks/useContacts';

// ============================================
// Tâche « contacts inactifs » (demande client) : quand des contacts n'ont
// eu AUCUNE interaction depuis 80 jours, le conseiller est alerté et les
// traite UN PAR UN ici (appeler, SMS, ou noter un échange).
// Sortie de liste = uniquement une VRAIE interaction :
//   - une note d'échange ajoutée (preuve de contact), ou
//   - une relance marquée faite (dateDerniereRelance = aujourd'hui).
// Une relance simplement planifiée ne compte PAS.
// ============================================

interface RelanceInactifsModalProps {
  inactifs: ContactInactif[];
  contactsState: ReturnType<typeof useContacts>;
  isEs?: boolean;
  onClose: () => void;
}

export function RelanceInactifsModal({ inactifs, contactsState, isEs = false, onClose }: RelanceInactifsModalProps) {
  const [index, setIndex] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const current = inactifs[index];
  const total = inactifs.length;

  if (!current) return null;

  const c = current.contact;
  const displayName = [c.prenom, c.nom].filter(Boolean).join(' ') || c.nom;

  const next = () => {
    setNoteText('');
    setNoteSaved(false);
    if (index + 1 < total) setIndex(index + 1);
    else onClose();
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    contactsState.addNote(c.id, noteText.trim());
    setNoteSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-5 space-y-4">
          {/* En-tête avec progression */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                {isEs ? 'Contactos por relanzar' : 'Contacts à relancer'}
              </p>
              <p className="text-sm text-gray-500">
                {index + 1} / {total}
              </p>
            </div>
            <button onClick={onClose} aria-label={isEs ? 'Cerrar' : 'Fermer'} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rappel de la règle */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              {isEs
                ? '⚠️ Este contacto será eliminado automáticamente si no hay acción de seguimiento, intercambio o nota que lo registre.'
                : '⚠️ Ce contact sera supprimé automatiquement s\'il n\'y a pas d\'action de relance, d\'échange, et de note pour en faire état.'}
            </p>
          </div>

          {/* Fiche du contact courant */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900 text-lg">{displayName}</p>
            {c.telephone && (
              <p className="text-sm text-gray-600 mt-0.5">{c.telephone}</p>
            )}
            {c.contexte && (
              <p className="text-sm text-gray-500 mt-1 italic">{c.contexte}</p>
            )}
            <p className="text-xs text-red-600 font-medium mt-2">
              {isEs
                ? `Sin interacción desde hace ${current.joursSansInteraction} días`
                : `Sans interaction depuis ${current.joursSansInteraction} jours`}
            </p>
          </div>

          {/* Actions de contact direct */}
          <div className="flex gap-2">
            {c.telephone && (
              <>
                <a
                  href={`tel:${c.telephone.replace(/\s/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  <Phone className="w-4 h-4" /> {isEs ? 'Llamar' : 'Appeler'}
                </a>
                <a
                  href={`sms:${c.telephone.replace(/\s/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" /> SMS
                </a>
              </>
            )}
          </div>

          {/* Preuve d'échange : la note */}
          <div>
            <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
              <StickyNote className="w-3.5 h-3.5 text-gray-500" />
              {isEs ? 'Nota del intercambio (obligatoria para sacarlo de la lista)' : 'Note de l\'échange (obligatoire pour le sortir de la liste)'}
            </p>
            <Textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={isEs
                ? 'Ej.: « Llamado el 12/08 — siempre interesado, cita prevista el 20/08 »'
                : 'Ex : « Appelé le 12/08 — toujours intéressé, RDV prévu le 20/08 »'}
              rows={2}
            />
            {/* Avertissement honnêteté / responsabilité RGPD */}
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              {isEs
                ? '⚠️ No marque un intercambio como realizado si no lo fue: podría haber controles. Es su responsabilidad según el RGPD.'
                : '⚠️ Ne marque un échange comme fait que s\'il a réellement eu lieu : des contrôles sont possibles. C\'est ta responsabilité au regard du RGPD.'}
            </p>
            <Button
              onClick={handleAddNote}
              disabled={!noteText.trim() || noteSaved}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50"
              size="sm"
            >
              {noteSaved
                ? (isEs ? '✓ Nota guardada — contacto reactivado' : '✓ Note enregistrée — contact réactivé')
                : (isEs ? 'Guardar la nota' : 'Enregistrer la note')}
            </Button>
          </div>

          {/* Navigation un par un */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={next} className="flex-1">
              {noteSaved
                ? (isEs ? 'Siguiente' : 'Suivant')
                : (isEs ? 'Saltar (sin acción)' : 'Passer (sans action)')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {!noteSaved && (
            <p className="text-[11px] text-center text-gray-400">
              {isEs
                ? 'Si lo saltas, este contacto seguirá en la lista mañana.'
                : 'Si tu passes, ce contact restera dans la liste demain.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
