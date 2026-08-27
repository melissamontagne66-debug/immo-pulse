import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { UserProgress } from '@/types';
import type { Sale } from '@/hooks/useSales';
import type { UserProfile } from '@/types/profile';
import { getJalons, getNiveau, getPaliersSerie, getSemaineProgramme, formatDateJalon } from '@/lib/jalons';
import { plural } from '@/lib/goals';
import { toLocalDateKey, parseLocalDateKey } from '@/lib/utils';

// ============================================
// MOD-31 — Page « Mon parcours » : timeline des jalons, niveau de carrière,
// heatmap de constance 6 mois.
// MOD-33 — « Mon mur de victoires » : victoires des bilans + jalons atteints
// + paliers de série, versés automatiquement.
// ============================================

interface MonParcoursProps {
  progress: UserProgress;
  sales: Sale[];
  profile: UserProfile;
}

// Intensité de la heatmap : nombre de compteurs du bilan > 0 (parmi
// conversations, contacts, R1, R2, mandats, visites, offres — 0 à 7),
// ramené à 4 niveaux d'opacité. Pas de bilan = case vide.
function heatmapOpacity(actions: number): number {
  if (actions <= 0) return 0.25;
  if (actions <= 2) return 0.45;
  if (actions <= 4) return 0.7;
  return 1;
}

export function MonParcours({ progress, sales, profile }: MonParcoursProps) {
  const isEs = profile.language === 'es';
  const dailyResults = progress.dailyResults;

  const jalons = useMemo(() => getJalons(progress, sales), [progress, sales]);
  const niveau = useMemo(() => getNiveau(progress, sales), [progress, sales]);
  const semaine = getSemaineProgramme(profile.startDate);

  const jalonsAtteints = jalons.filter(j => j.atteint);
  const jalonsAVenir = jalons.filter(j => !j.atteint);

  // Heatmap 6 mois : 26 semaines, colonnes = semaines, lignes = jours (lun→dim).
  const heatmapDays = useMemo(() => {
    const byDate = new Map(dailyResults.map(r => [r.date, r]));
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 7 * 25);
    // Alignement sur le lundi de la semaine de départ
    const dow = start.getDay();
    start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
    const days: { key: string; bilan: boolean; actions: number }[] = [];
    const d = new Date(start);
    while (d <= today) {
      const key = toLocalDateKey(d);
      const r = byDate.get(key);
      let actions = 0;
      if (r) {
        actions = [r.callsMade, r.contactsApproached, r.rdvR1Done, r.rdvR2Done, r.mandatsSigned, r.visitesDone, r.offresWritten]
          .filter(v => (v || 0) > 0).length;
      }
      days.push({ key, bilan: !!r, actions });
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [dailyResults]);

  // Mur de victoires : victoires saisies + jalons atteints + paliers de série,
  // triés du plus récent au plus ancien.
  const mur = useMemo(() => {
    const entries: { date: string; texte: string }[] = [];
    for (const r of dailyResults) {
      if (r.wins?.trim()) entries.push({ date: r.date, texte: r.wins.trim() });
    }
    for (const j of jalonsAtteints) {
      if (j.dateAtteinte) entries.push({ date: j.dateAtteinte, texte: `🏆 ${isEs ? j.titreEs : j.titre}` });
    }
    for (const p of getPaliersSerie(dailyResults)) {
      entries.push({
        date: p.date,
        texte: isEs
          ? `🔥 ${plural(p.jours, 'día')} de balances seguidos`
          : `🔥 ${plural(p.jours, 'jour')} de bilans d'affilée`,
      });
    }
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyResults, jalonsAtteints, isEs]);

  const formatDateCourte = (key: string) =>
    parseLocalDateKey(key).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR');

  return (
    <div className="space-y-6">
      {/* Header + niveau de carrière */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEs ? 'Mi recorrido' : 'Mon parcours'}</h2>
          <p
            className="text-gray-500 mt-1"
            title={isEs ? 'Basado en mis balances completados y mis hitos.' : 'Basé sur mes bilans complétés et mes jalons.'}
          >
            {isEs ? `Programa 6 meses — semana ${semaine}/26` : `Programme 6 mois — semaine ${semaine}/26`}
          </p>
        </div>
        <div
          className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-lg"
          title={isEs ? 'Mi nivel de carrera' : 'Mon niveau de carrière'}
        >
          <span className="font-semibold text-sm">
            {isEs ? 'Nivel' : 'Niveau'} : {niveau.emoji} {isEs ? niveau.labelEs : niveau.label}
          </span>
        </div>
      </div>

      {/* Timeline des jalons */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {isEs ? 'Mis hitos' : 'Mes jalons'}
          </h3>
          <div className="relative border-l-2 border-gray-200 ml-2 space-y-4">
            {jalonsAtteints.map(j => (
              <div key={j.id} className="relative pl-6">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold text-gray-900">{isEs ? j.titreEs : j.titre}</p>
                {j.dateAtteinte && (
                  <p className="text-xs text-gray-500">{formatDateJalon(j.dateAtteinte, isEs)}</p>
                )}
              </div>
            ))}
            {jalonsAVenir.map(j => (
              <div key={j.id} className="relative pl-6 opacity-60">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-gray-300" />
                <p className="text-sm font-medium text-gray-500">{isEs ? j.titreEs : j.titre}</p>
                <p className="text-xs text-gray-400">{isEs ? j.commentObtenirEs : j.commentObtenir}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Heatmap de constance — 6 derniers mois */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {isEs ? 'Mi constancia (6 meses)' : 'Ma constance (6 mois)'}
          </h3>
          <div className="overflow-x-auto">
            {/* Sur mobile, cellules réduites pour que les 26 semaines tiennent
                en largeur sans glisser (max-sm ≈ 260 px). */}
            <div className="grid grid-rows-7 grid-flow-col gap-1 max-sm:gap-0.5 w-max">
              {heatmapDays.map(day => (
                <div
                  key={day.key}
                  title={
                    day.bilan
                      ? `${formatDateCourte(day.key)} — ${isEs ? plural(day.actions, 'acción', 'acciones') : plural(day.actions, 'action')}`
                      : `${formatDateCourte(day.key)} — ${isEs ? 'sin balance' : 'pas de bilan'}`
                  }
                  className={`w-3 h-3 max-sm:w-2 max-sm:h-2 rounded-[3px] ${day.bilan ? 'bg-emerald-500' : 'bg-gray-100'}`}
                  style={day.bilan ? { opacity: heatmapOpacity(day.actions) } : undefined}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {isEs
              ? 'Cada casilla = un día con balance. Más intensa = más acciones hechas ese día.'
              : 'Chaque case = un jour avec bilan. Plus elle est foncée, plus tu as fait d’actions ce jour-là.'}
          </p>
        </CardContent>
      </Card>

      {/* MOD-33 — Mur de victoires */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {isEs ? '🏆 Mi muro de victorias' : '🏆 Mon mur de victoires'}
          </h3>
          {mur.length === 0 ? (
            <p className="text-sm text-gray-400">
              {isEs
                ? 'Mi primera victoria llegará pronto — aparecerá aquí.'
                : 'Ma première victoire arrivera vite — elle s\'affichera ici.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {mur.map((entry, i) => (
                <div key={`${entry.date}-${i}`} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400">{formatDateCourte(entry.date)}</p>
                  <p className="text-sm text-gray-800">{entry.texte}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
