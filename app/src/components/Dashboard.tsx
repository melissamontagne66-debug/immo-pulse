import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSmartDashboard } from '@/hooks/useSmartDashboard';
import { useDailyCounters, type CounterKey } from '@/hooks/useDailyCounters';
import type { Sale } from '@/hooks/useSales';
import type { useContacts } from '@/hooks/useContacts';
import type { UserProfile } from '@/types/profile';
import { getGoals, plural } from '@/lib/goals';
import type { UserProgress, DailyResults } from '@/types';
import type { WeekPlan } from '@/types';
import { Flame, Target, AlertTriangle, ArrowRight, Sunrise, Minus, Plus, Banknote } from 'lucide-react';
import { formatEuro, toLocalDateKey, parseLocalDateKey } from '@/lib/utils';
import { RdvInfoTooltip } from '@/components/RdvInfoTooltip';
import { Phone, Calendar, FileCheck, Home, DoorOpen } from 'lucide-react';
import { getDefiForDay } from '@/data/defis';
import { DefiCard } from '@/components/DefiCard';
import { ConseilDuJour } from '@/components/ConseilDuJour';
import { getTemoignageForUser } from '@/lib/temoignages';
import { TemoignageCard } from '@/components/TemoignageCard';
import { getProtocole, getVictoireAleatoire } from '@/lib/antiDecrochage';
import { getJoursDepuisDerniereOuverture, getNiveau, getSemaineProgramme, touchLastOpen } from '@/lib/jalons';

interface DashboardProps {
  progress: UserProgress;
  completionRate: number;
  currentDay: number;
  profile: UserProfile;
  dailyResults: DailyResults[];
  // Conservée pour compat avec App.tsx — les objectifs sont lus depuis @/lib/goals (MOD-19)
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  currentWeek: WeekPlan;
  onNavigate: (tab: string) => void;
  onSetMonthlyGoal: () => void;
  sales: Sale[];
  contactsState: ReturnType<typeof useContacts>;
}

export function Dashboard({ progress, currentDay, profile, dailyResults, onNavigate, onSetMonthlyGoal, sales, contactsState }: DashboardProps) {
  const { insights } = useSmartDashboard(dailyResults, profile, currentDay, progress.streak.count);
  const alertes = insights.filter(i => i.type === 'alerte');
  const isEs = profile.language === 'es';
  const { counters, increment } = useDailyCounters();

  // Objectifs — source unique : src/lib/goals.ts (MOD-19)
  // MOD-27 : protocole anti-décrochage actif → objectifs allégés 48 h.
  // Recalculé à chaque rendu (lecture localStorage) : un bilan enregistré
  // met à jour le dashboard sans rechargement.
  const protocole = getProtocole();

  // MOD-31 — retour après absence (≥ 3 jours sans ouverture) : carte de
  // bienvenue + objectifs allégés ce jour-là (même mécanisme que MOD-27).
  // Lecture pure dans useState (StrictMode-safe), écriture dans useEffect.
  const [joursAbsence] = useState(() => getJoursDepuisDerniereOuverture(progress.streak.lastBilanDate));
  useEffect(() => { touchLastOpen(); }, []);

  // MOD-31 — niveau de carrière + semaine de programme (header).
  const niveau = getNiveau(progress, sales);
  const semaine = getSemaineProgramme(profile.startDate);

  // MOD-33 — victoire passée rappelée sur la carte de soutien.
  const victoireSouvenir = useMemo(() => getVictoireAleatoire(dailyResults), [dailyResults]);

  const consolidation = !!protocole || joursAbsence > 0;
  const goals = getGoals(profile, currentDay, dailyResults, { consolidation });
  const monthlyMandatTarget = goals.monthlyMandats;

  // Mandats signés ce mois-ci (depuis le 1er du mois)
  const mandatsThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = toLocalDateKey(new Date(now.getFullYear(), now.getMonth(), 1));
    return dailyResults
      .filter(r => r.date >= monthStart)
      .reduce((sum, r) => sum + r.mandatsSigned, 0);
  }, [dailyResults]);

  const currentMonth = toLocalDateKey(new Date()).slice(0, 7); // 'YYYY-MM'

  // Ventes du mois qui comptent aussi comme mandat (enregistrées via le calculateur)
  const mandatsVentes = sales.filter(s => s.countsAsMandat && s.date.startsWith(currentMonth)).length;
  const mandatsThisMonthTotal = mandatsThisMonth + mandatsVentes;

  // CA du mois = honoraires d'agence encaissés sur les ventes enregistrées
  const caThisMonth = sales.filter(s => s.date.startsWith(currentMonth)).reduce((sum, s) => sum + s.fees, 0);
  const caTarget = Math.round(profile.ca6MonthsTarget / 6);
  const caPct = caTarget > 0 ? Math.min(100, Math.round((caThisMonth / caTarget) * 100)) : 0;

  // Contacts à relancer aujourd'hui (ou en retard)
  const dueContacts = contactsState.getDueContacts();

  // MOD-23 — Défi du jour (déterministe, stable dans la journée)
  const defi = getDefiForDay(currentDay);

  // MOD-24 — Témoignage personnalisé du jour (1/jour, jamais 2 fois le même sur 7 jours)
  // MOD-27 — pendant le protocole, matching « coup-dur » forcé (+5).
  const temoignage = useMemo(() => getTemoignageForUser(profile, { coupDur: consolidation }), [profile, consolidation]);

  // MOD-27 — objectifs de référence (non allégés) pour la ligne « au lieu de ».
  const convoAllegee = goals.dailyGoals.find(g => g.key === 'conversations');
  const convoRef = consolidation
    ? getGoals(profile, currentDay, dailyResults).dailyGoals.find(g => g.key === 'conversations')
    : undefined;

  // Objectifs quotidiens (sans mandat qui est maintenant mensuel) — depuis goals.ts
  const objectiveStyle: Record<CounterKey, { icon: any; color: string; bg: string; border: string }> = {
    conversations: { icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    contacts: { icon: DoorOpen, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    r1: { icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    r2: { icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    visites: { icon: Home, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  };
  const dailyObjectives = goals.dailyGoals.map(g => ({ key: g.key, label: g.label, value: g.target, ...objectiveStyle[g.key] }));

  // Progression mandats par semaine
  const mandatProgressPct = monthlyMandatTarget > 0 ? Math.min(100, Math.round((mandatsThisMonthTotal / monthlyMandatTarget) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.firstName ? `Bienvenue ${profile.firstName} !` : 'Objectifs du jour'}
          </h2>
          <p
            className="text-gray-500 mt-1"
            title={isEs ? 'Basado en tus balances completados y tus hitos.' : 'Basé sur tes bilans complétés et tes jalons.'}
          >
            Jour {currentDay} · {isEs ? `Programa 6 meses — semana ${semaine}/26` : `Programme 6 mois — semaine ${semaine}/26`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSetMonthlyGoal}
            className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Target className="w-4 h-4" />
            Objectif du mois : {formatEuro(Math.round(profile.ca6MonthsTarget / 6))} ({formatEuro(profile.ca6MonthsTarget)} sur 6 mois)
          </button>
          <button
            onClick={() => onNavigate('parcours')}
            className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-100 transition-colors"
            title={isEs ? 'Ver tu recorrido' : 'Voir ton parcours'}
          >
            {niveau.emoji} {isEs ? niveau.labelEs : niveau.label}
          </button>
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
            <Flame className="w-5 h-5" />
            <span className="font-semibold text-sm">{plural(progress.streak.count, 'jour')}</span>
          </div>
        </div>
      </div>

      {/* MOD-27 — Carte de soutien anti-décrochage (jamais de mention du
          « protocole » ni de son niveau : ton bienveillant uniquement).
          Le profil n'a pas de coordonnées de parrain (seulement hasMentor) :
          la suggestion parrain/manager reste donc une phrase, sans bouton. */}
      {protocole && (
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            {protocole.level === 1 ? (
              <p className="text-sm text-emerald-800">
                {isEs
                  ? `💚 ${profile.firstName ? `${profile.firstName}, ayer` : 'Ayer'} no fue un día fácil — es normal, este trabajo sacude. Hoy aligeramos: un solo objetivo, el tuyo.`
                  : `💚 ${profile.firstName ? `${profile.firstName}, hier` : 'Hier'} n'était pas un jour facile — c'est normal, ce métier secoue. Aujourd'hui, on allège : un seul objectif, le tien.`}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-emerald-800">
                  {protocole.history[protocole.history.length - 1]?.trigger === 'aucun-mandat-45j'
                    ? (isEs
                      ? '💚 El primer mandato se hace esperar — es el tramo más duro del oficio, y es exactamente donde los demás aguantaron. Consolidamos 48 h, juntos.'
                      : '💚 Le premier mandat se fait attendre — c\'est le passage le plus dur du métier, et c\'est exactement là que les autres ont tenu bon. On consolide 48 h, ensemble.')
                    : (isEs
                      ? '💚 Dos días difíciles seguidos: les pasa a todos los que después triunfan. Pasamos a modo consolidación 48 h.'
                      : '💚 Deux jours difficiles d\'affilée : ça arrive à tous ceux qui réussissent ensuite. On passe en mode consolidation 48 h.')}
                </p>
                <p className="text-sm text-emerald-700">
                  {isEs
                    ? `¿Y si hablas con ${profile.hasMentor ? 'tu padrino' : 'tu manager'}? Una llamada de 5 minutos cambia una jornada.`
                    : `Et si tu en parlais à ${profile.hasMentor ? 'ton parrain' : 'ton manager'} ? Un appel de 5 minutes, ça change une journée.`}
                </p>
              </div>
            )}
            {/* MOD-33 — rappel d'une victoire passée sur la carte de soutien */}
            {victoireSouvenir && (
              <p className="text-sm text-emerald-700 mt-1">
                {isEs
                  ? `Recuerda: ${parseLocalDateKey(victoireSouvenir.date).toLocaleDateString('es-ES')} — ${victoireSouvenir.texte}.`
                  : `Souviens-toi\u00A0: ${parseLocalDateKey(victoireSouvenir.date).toLocaleDateString('fr-FR')} — ${victoireSouvenir.texte}.`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* MOD-31 — Carte de retour après absence (≥ 3 jours sans ouverture) */}
      {joursAbsence > 0 && (
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <p className="text-sm text-sky-800">
              {isEs
                ? `👋 ¡Qué bueno verte de nuevo${profile.firstName ? `, ${profile.firstName}` : ''}! Han pasado ${plural(joursAbsence, 'día')}. Retomamos con calma: una sola acción hoy, aquí está.`
                : `👋 Content de te revoir${profile.firstName ? `, ${profile.firstName}` : ''}\u00A0! Ça fait ${plural(joursAbsence, 'jour')}. On repart doucement\u00A0: 1 seule action aujourd'hui, la voici.`}
            </p>
            <button
              onClick={() => onNavigate('today')}
              className="flex-shrink-0 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {isEs ? 'Mi acción de hoy' : 'Mon action du jour'}
            </button>
          </CardContent>
        </Card>
      )}

      {/* Objectif mensuel de mandats — carte principale */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-semibold text-purple-800">Objectif mandats ce mois-ci</p>
            </div>
            <p className="text-xs text-purple-600 bg-white px-2 py-0.5 rounded-full font-medium">{mandatsThisMonthTotal} / {monthlyMandatTarget}</p>
          </div>
          {/* Barre de progression */}
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${mandatProgressPct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-purple-600">{mandatProgressPct}&nbsp;% atteint</p>
            <p className="text-xs text-purple-500">{isEs ? `aprox. ${plural(goals.weeklyMandats, 'mandato')} por semana` : `environ ${plural(goals.weeklyMandats, 'mandat')} par semaine`}</p>
          </div>
        </CardContent>
      </Card>

      {/* CA du mois — honoraires encaissés sur les ventes enregistrées */}
      <Card className="bg-green-50 border-green-200" title="CA = honoraires d'agence encaissés sur tes ventes du mois.">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">CA réalisé ce mois&nbsp;: {formatEuro(caThisMonth)} / Objectif&nbsp;: {formatEuro(caTarget)}</p>
            </div>
            <p className="text-xs text-green-600 bg-white px-2 py-0.5 rounded-full font-medium">{caPct}&nbsp;%</p>
          </div>
          {/* Barre de progression */}
          <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${caPct}%` }} />
          </div>
          <p className="text-xs text-green-600 mt-1">{caPct}&nbsp;% atteint</p>
        </CardContent>
      </Card>

      {/* Relances de contacts dues aujourd'hui (ou en retard) */}
      {dueContacts.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-800">📞 À relancer aujourd'hui&nbsp;:</p>
            {dueContacts.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-3 bg-white/70 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-800 min-w-0 truncate">
                  <span className="font-medium">{c.nom || 'Sans nom'}</span>
                  {c.contexte && <> — {c.contexte.length > 60 ? `${c.contexte.slice(0, 60)}…` : c.contexte}</>}
                </p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {c.telephone && (
                    <a
                      href={`tel:${c.telephone.replace(/\s+/g, '')}`}
                      className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Appeler
                    </a>
                  )}
                  <button
                    onClick={() => contactsState.postponeContact(c.id)}
                    className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    Repousser
                  </button>
                  <button
                    onClick={() => contactsState.updateContact(c.id, { dateRelance: '' })}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Fait
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Objectifs du jour — petites cartes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tes objectifs aujourd'hui</h3>
        {consolidation && convoRef && convoAllegee && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
            {isEs
              ? `Modo consolidación: ${convoAllegee.target} conversaciones en lugar de ${convoRef.target} — consolidamos, no soltamos nada.`
              : `Mode consolidation : ${convoAllegee.target} conversations au lieu de ${convoRef.target} — on consolide, on ne lâche rien.`}
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {dailyObjectives.map(obj => {
            const count = counters[obj.key];
            const done = count >= obj.value;
            return (
              <Card key={obj.key} className={`${done ? 'border-green-300 bg-green-50' : `${obj.border} ${obj.bg}`} hover:shadow-md transition-shadow cursor-pointer`} onClick={() => onNavigate('today')}>
                <CardContent className="p-4 text-center">
                  <obj.icon className={`w-6 h-6 ${done ? 'text-green-600' : obj.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-gray-900">
                    {count}<span className="text-base font-semibold text-gray-400">/{obj.value}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                    {obj.label}
                    {(obj.key === 'r1' || obj.key === 'r2') && <RdvInfoTooltip type={obj.key} isEs={isEs} />}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      onClick={e => { e.stopPropagation(); increment(obj.key, -1); }}
                      disabled={count <= 0}
                      aria-label={isEs ? `Quitar 1 ${obj.label}` : `Retirer 1 ${obj.label}`}
                      className="w-7 h-7 rounded-full bg-white/80 border border-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); increment(obj.key, 1); }}
                      aria-label={isEs ? `Añadir 1 ${obj.label}` : `Ajouter 1 ${obj.label}`}
                      className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Bouton vers l'onglet Aujourd'hui */}
      <button
        onClick={() => onNavigate('today')}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
      >
        <Sunrise className="w-5 h-5" />
        Ton action du jour
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* MOD-34 — Conseil du jour (déterministe, pool de 15, src/data/conseils.ts) */}
      <ConseilDuJour day={currentDay} isEs={isEs} />

      {/* MOD-23 — Défi du jour (carte unique, renvoyée depuis l'onglet Aujourd'hui) */}
      <DefiCard defi={defi} isEs={isEs} />

      {/* MOD-24 — Témoignage personnalisé du jour */}
      <TemoignageCard temoignage={temoignage} isEs={isEs} />


      {/* ALERTES */}
      {alertes.length > 0 && (
        <div className="space-y-3">
          {alertes.map(alert => (
            <Card key={alert.id} className="border bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{alert.emoji} {alert.title}</p>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
