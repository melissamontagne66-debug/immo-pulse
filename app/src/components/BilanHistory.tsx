import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { DailyResults } from '@/types';
import { toLocalDateKey, parseLocalDateKey } from '@/lib/utils';
import { Calendar, BarChart3, TrendingUp, Star, Phone, Users, CalendarCheck, Home, FileCheck, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

type ViewMode = 'week' | 'month';

interface BilanHistoryProps {
  dailyResults: DailyResults[];
  onBack: () => void;
}

// Langue de l'interface lue depuis la session (iad-coach-session) puis le profil
// local (iad-coach-profile-{email}) — le composant ne reçoit pas `profile` en props.
function readIsEs(): boolean {
  try {
    const sessionRaw = localStorage.getItem('iad-coach-session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const email = session?.email;
    if (email) {
      const profileRaw = localStorage.getItem(`iad-coach-profile-${email}`);
      const profile = profileRaw ? JSON.parse(profileRaw) : null;
      return profile?.language === 'es';
    }
    return session?.language === 'es';
  } catch { return false; }
}

export function BilanHistory({ dailyResults, onBack }: BilanHistoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentPeriod, setCurrentPeriod] = useState(0); // 0 = current, -1 = previous, etc.

  const isEs = readIsEs();
  const dateLocale = isEs ? 'es-ES' : 'fr-FR';

  const today = new Date();

  // Get period dates
  const getPeriodDates = () => {
    if (viewMode === 'week') {
      // Week starts on Monday
      const startOfWeek = new Date(today);
      const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
      startOfWeek.setDate(diff - currentPeriod * 7);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return { start: startOfWeek, end: endOfWeek };
    } else {
      // Month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - currentPeriod, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() - currentPeriod + 1, 0, 23, 59, 59, 999);
      return { start: startOfMonth, end: endOfMonth };
    }
  };

  const period = getPeriodDates();
  // Clés de date locales YYYY-MM-DD — les comparaisons se font en chaînes pour
  // éviter les décalages UTC (bug « Aucune donnée » sur un jour avec bilan).
  const periodStartKey = toLocalDateKey(period.start);
  const periodEndKey = toLocalDateKey(period.end);

  // Filter results for current period
  const periodResults = useMemo(() => {
    return dailyResults.filter(r => {
      return r.date >= periodStartKey && r.date <= periodEndKey;
    }).sort((a, b) => parseLocalDateKey(b.date).getTime() - parseLocalDateKey(a.date).getTime());
  }, [dailyResults, periodStartKey, periodEndKey]);

  // Aggregated stats
  const stats = useMemo(() => {
    const totals = periodResults.reduce((acc, r) => ({
      callsMade: acc.callsMade + r.callsMade,
      contactsApproached: acc.contactsApproached + r.contactsApproached,
      rdvR1Done: acc.rdvR1Done + r.rdvR1Done,
      rdvR2Done: acc.rdvR2Done + r.rdvR2Done,
      mandatsSigned: acc.mandatsSigned + r.mandatsSigned,
      visitesDone: acc.visitesDone + r.visitesDone,
      offresWritten: acc.offresWritten + r.offresWritten,
      daysTracked: acc.daysTracked + 1,
      moodSum: acc.moodSum + r.mood,
    }), { callsMade: 0, contactsApproached: 0, rdvR1Done: 0, rdvR2Done: 0, mandatsSigned: 0, visitesDone: 0, offresWritten: 0, daysTracked: 0, moodSum: 0 });

    return {
      ...totals,
      avgMood: totals.daysTracked > 0 ? (totals.moodSum / totals.daysTracked).toFixed(1) : '0',
    };
  }, [periodResults]);

  // Day-by-day breakdown
  const dailyBreakdown = useMemo(() => {
    const days: { date: string; label: string; results: DailyResults | null }[] = [];
    const current = new Date(period.start);
    while (current <= period.end) {
      const dateStr = toLocalDateKey(current);
      const result = periodResults.find(r => r.date === dateStr) || null;
      days.push({
        date: dateStr,
        label: current.toLocaleDateString(dateLocale, { weekday: 'short', day: 'numeric' }),
        results: result,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [period.start, period.end, periodResults, dateLocale]);

  const periodLabel = viewMode === 'week'
    ? isEs
      ? `Semana del ${period.start.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long' })}`
      : `Semaine du ${period.start.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long' })}`
    : period.start.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}><ChevronLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-600" />
              {isEs ? 'Historial de balances' : 'Historique des bilans'}
            </h2>
            <p className="text-gray-500 mt-1">{isEs ? 'Resumen de su actividad' : 'Aperçu de ton activité'}</p>
          </div>
        </div>
      </div>

      {/* View mode selector */}
      <div className="flex gap-2">
        {([{ key: 'week', label: isEs ? 'Por semana' : 'Par semaine' }, { key: 'month', label: isEs ? 'Por mes' : 'Par mois' }] as const).map(v => (
          <button
            key={v.key}
            onClick={() => { setViewMode(v.key); setCurrentPeriod(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === v.key
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Period navigation */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
        <button onClick={() => setCurrentPeriod(p => p + 1)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <p className="text-sm font-semibold text-gray-900">{periodLabel}</p>
        <button
          onClick={() => setCurrentPeriod(p => Math.max(0, p - 1))}
          className={`p-2 rounded-lg transition-colors ${currentPeriod > 0 ? 'hover:bg-gray-200' : 'opacity-30 cursor-not-allowed'}`}
          disabled={currentPeriod === 0}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Stats cards */}
      {periodResults.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-3 text-center">
              <Phone className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.callsMade}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Conversaciones' : 'Conversations'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.contactsApproached}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Contactos físicos' : 'Contacts physiques'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <CalendarCheck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.rdvR1Done + stats.rdvR2Done}</p>
              <p className="text-xs text-gray-500">{isEs ? `Citas (${stats.rdvR1Done} R1 + ${stats.rdvR2Done} R2)` : `RDV (${stats.rdvR1Done} R1 + ${stats.rdvR2Done} R2)`}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <FileCheck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.mandatsSigned}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Mandatos firmados' : 'Mandats signés'}</p>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-3 text-center">
              <Home className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.visitesDone}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Visitas realizadas' : 'Visites effectuées'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.offresWritten}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Ofertas redactadas' : 'Offres rédigées'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.daysTracked}</p>
              <p className="text-xs text-gray-500">{isEs ? 'Días registrados' : 'Jours suivis'}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-900">{stats.avgMood}<span className="text-sm text-gray-400">/5</span></p>
              <p className="text-xs text-gray-500">{isEs ? 'Estado de ánimo medio' : 'Humeur moyenne'}</p>
            </CardContent></Card>
          </div>

          {/* Day-by-day chart */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">{isEs ? 'Actividad día a día' : 'Activité jour par jour'}</h3>
              <div className="space-y-3">
                {dailyBreakdown.map(day => (
                  <div key={day.date} className={`p-3 rounded-lg border ${day.results ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 capitalize">{day.label}</p>
                      {day.results && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span className="text-xs text-gray-500">{day.results.mood}/5</span>
                        </div>
                      )}
                    </div>
                    {day.results ? (
                      <>
                        <div className="flex gap-2 flex-wrap">
                          {day.results.callsMade > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{day.results.callsMade} conv.</span>}
                          {day.results.contactsApproached > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{day.results.contactsApproached} {isEs ? 'contactos' : 'contacts'}</span>}
                          {day.results.rdvR1Done > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{day.results.rdvR1Done} R1</span>}
                          {day.results.rdvR2Done > 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{day.results.rdvR2Done} R2</span>}
                          {day.results.mandatsSigned > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{day.results.mandatsSigned} {isEs ? `mandato${day.results.mandatsSigned > 1 ? 's' : ''}` : `mandat${day.results.mandatsSigned > 1 ? 's' : ''}`}</span>}
                          {day.results.visitesDone > 0 && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{day.results.visitesDone} {isEs ? `visita${day.results.visitesDone > 1 ? 's' : ''}` : `visite${day.results.visitesDone > 1 ? 's' : ''}`}</span>}
                          {day.results.offresWritten > 0 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{day.results.offresWritten} {isEs ? `oferta${day.results.offresWritten > 1 ? 's' : ''}` : `offre${day.results.offresWritten > 1 ? 's' : ''}`}</span>}
                        </div>
                        {day.results.notes && (
                          <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">{day.results.notes}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">{isEs ? 'Sin datos' : 'Aucune donnée'}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Graphiques visuels - Radar d'activité */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                {isEs ? 'Reparto de su actividad' : 'Répartition de ton activité'}
              </h3>
              {/* Barres horizontales */}
              <div className="space-y-4">
                {[
                  { label: isEs ? 'Conversaciones' : 'Conversations', value: stats.callsMade, color: 'bg-blue-500', icon: Phone },
                  { label: isEs ? 'Contactos físicos' : 'Contacts physiques', value: stats.contactsApproached, color: 'bg-green-500', icon: Users },
                  { label: 'R1', value: stats.rdvR1Done, color: 'bg-purple-500', icon: CalendarCheck },
                  { label: 'R2', value: stats.rdvR2Done, color: 'bg-indigo-500', icon: CalendarCheck },
                  { label: isEs ? 'Mandatos' : 'Mandats', value: stats.mandatsSigned, color: 'bg-red-500', icon: FileCheck },
                  { label: isEs ? 'Visitas' : 'Visites', value: stats.visitesDone, color: 'bg-teal-500', icon: Home },
                  { label: isEs ? 'Ofertas' : 'Offres', value: stats.offresWritten, color: 'bg-orange-500', icon: TrendingUp },
                ].filter(item => item.value > 0).map(item => {
                  const maxVal = Math.max(stats.callsMade, stats.contactsApproached, stats.rdvR1Done, stats.rdvR2Done, stats.mandatsSigned, stats.visitesDone, stats.offresWritten, 1);
                  const pct = Math.round((item.value / maxVal) * 100);
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-32 font-medium">{item.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className={`${item.color} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700`} style={{ width: `${pct}%` }}>
                          <span className="text-[10px] text-white font-bold">{item.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Graphique - Taux de conversion */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                {isEs ? 'Tasa de conversión' : 'Taux de conversion'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: isEs ? 'Contactos → R1' : 'Contacts → R1', num: stats.rdvR1Done, den: stats.contactsApproached, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'R1 → R2', num: stats.rdvR2Done, den: stats.rdvR1Done, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: isEs ? 'R2 → Mandato' : 'R2 → Mandat', num: stats.mandatsSigned, den: stats.rdvR2Done, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: isEs ? 'Mandato → Visita' : 'Mandat → Visite', num: stats.visitesDone, den: stats.mandatsSigned, color: 'text-teal-600', bg: 'bg-teal-50' },
                  { label: isEs ? 'Visita → Oferta' : 'Visite → Offre', num: stats.offresWritten, den: stats.visitesDone, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: isEs ? 'Conversaciones → Contacto' : 'Conversations → Contact', num: stats.contactsApproached, den: stats.callsMade, color: 'text-blue-600', bg: 'bg-blue-50' },
                ]
                  // Ratios sans dénominateur (0) masqués : « 0 % (1/0) » n'a pas de sens
                  .filter(conv => conv.den > 0)
                  .map(conv => {
                    const rate = Math.round((conv.num / conv.den) * 100);
                    return (
                      <div key={conv.label} className={`${conv.bg} rounded-xl p-3 text-center`}>
                        <p className="text-xs text-gray-500">{conv.label}</p>
                        <p className={`text-2xl font-bold ${conv.color}`}>{rate} %</p>
                        <p className="text-[10px] text-gray-400">{conv.num} / {conv.den}</p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Points critiques à analyser — CONSEILS DÉTAILLÉS */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Points à analyser pour le mois prochain
              </h3>
              <div className="space-y-4">
                {stats.contactsApproached === 0 && stats.daysTracked > 3 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-red-700 mb-1">🚨 Zéro contact physique sur {stats.daysTracked} jours</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Le terrain est le moteur absolu de ton business. Sans contact physique, tu ne peux pas signer de mandat. La méthode est simple : sors <strong>1h minimum chaque jour</strong> entre 11 h – 13 h 30 ou 17 h – 19 h. Sélectionne 1-2 biens sur ton outil, toque au bien + aux 10 voisins avec une recherche acquéreur ciblée et une estimation patrimoniale gratuite. Chaque porte toquée est un contact enregistré dans ton CRM — et dans 3 à 6 mois, ces contacts deviennent des mandats. <strong>Objectif mois prochain : au moins 15 contacts physiques.</strong></p>
                  </div>
                )}
                {stats.callsMade > 0 && stats.contactsApproached === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">📞 Tu fais {stats.callsMade} conversations mais aucun contact physique</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Le téléphone est utile, mais un contact physique vaut 10 appels. Quand tu appelles, l'objectif n'est pas de vendre au téléphone — c'est de <strong>fixer un RDV terrain</strong>. Propose toujours deux créneaux au choix plutôt qu'une question ouverte : la règle des 2 options fonctionne à chaque fois. Tes scripts d'accroche sont dans tes mémos de formation. <strong>Objectif mois prochain : transformer 20 % de tes conversations en contacts physiques.</strong></p>
                  </div>
                )}
                {stats.rdvR1Done > 0 && stats.rdvR2Done === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">📅 Tu as fait {stats.rdvR1Done} R1 mais aucun R2 de fixé</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Le R1 c'est la découverte — mais le but, c'est de fixer le R2 <strong>AVANT de partir</strong>. Dès le début du R1, écoute 80 % du temps pour comprendre ce qui compte vraiment pour le vendeur au-delà du prix. Avant de partir, propose ton rapport complet (comparables, délais de vente du secteur, stratégie de mise en vente) et offre deux créneaux au choix pour le R2 — jamais une question ouverte. Les formulations exactes sont dans tes mémos. <strong>Objectif mois prochain : fixer un R2 pour chaque R1 réalisé.</strong></p>
                  </div>
                )}
                {stats.rdvR2Done > 0 && stats.mandatsSigned === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">✍️ Tu as fait {stats.rdvR2Done} R2 mais aucun mandat signé</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Le R2, c'est le moment de vérité. Ta mission : <strong>PRÉSENTER ET VALIDER TES SERVICES EN PREMIERS</strong>. Commence par la Clause de Confiance et la Garantie 30 jours — prouve la valeur de ton accompagnement AVANT de donner le prix, sinon le vendeur n'écoutera plus rien après. Utilise les 3 scénarios (optimiste, réaliste, prudent). Après avoir donné le prix : <strong>silence complet</strong>. Si le vendeur hésite, propose un point à 24 h plutôt que de laisser le dossier refroidir. Les formulations exactes sont dans tes mémos. <strong>Objectif mois prochain : signer 1 mandat pour 2 R2 réalisés.</strong></p>
                  </div>
                )}
                {stats.mandatsSigned > 0 && stats.visitesDone === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">🏠 Tu as signé {stats.mandatsSigned} mandat{stats.mandatsSigned > 1 ? 's' : ''} mais aucune visite réalisée</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Un mandat sans visite, c'est un mandat dormeur. Dès la signature, ton objectif est de <strong>générer des visites en 48h</strong>. Fais les photos immédiatement — qualité professionnelle, lumière du jour, pièces rangées. Rédige un titre percutant : pas "Appartement T3" mais "T3 lumineux — vue dégagée — garage — secteur écoles". Mets en ligne sur toutes les plateformes (SeLoger, Leboncoin, PAP, Fnac Immo). Poste aussi sur tes réseaux sociaux avec une belle photo. Envoie le lien à tes acquéreurs enregistrés dans le CRM qui correspondent au critère. <strong>Objectif mois prochain : chaque mandat signé = visites en ligne en moins de 48h.</strong></p>
                  </div>
                )}
                {stats.visitesDone > 0 && stats.offresWritten === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">👀 Tu as fait {stats.visitesDone} visites mais aucune offre rédigée</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Les visites sans offre, c'est du temps perdu. Pendant la visite, <strong>crée l'urgence</strong> chez l'acheteur en partageant l'activité réelle du secteur (autres acquéreurs sur ce type de bien, visites programmées). Dès la visite terminée, relance rapidement pour connaître sa position, et s'il hésite sur le prix, réfléchis à une contrepartie possible (délai, mobilier, conditions). Tes scripts de relance et de gestion des objections sont dans tes mémos. <strong>Objectif mois prochain : 1 offre pour 2 visites minimum.</strong></p>
                  </div>
                )}
                {parseFloat(stats.avgMood) < 3 && stats.daysTracked > 3 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-red-700 mb-1">😔 Ton humeur moyenne est basse ({stats.avgMood}/5)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">L'immobilier est un métier émotionnellement exigeant. Une humeur basse sur plusieurs jours est un signal d'alerte. Voici ce que tu peux faire : <strong>1)</strong> Célèbre chaque micro-victoire — une porte toquée, un contact enregistré, un R1 fixé. <strong>2)</strong> Parle à ton manager ou un collègue confirmé, même 10 minutes par jour. <strong>3)</strong> Varie ton secteur — si une rue te résiste, change de zone. <strong>4)</strong> Fais du picking en duo avec un collègue, c'est plus motivant. <strong>5)</strong> Rappelle-toi : chaque "non" te rapproche du "oui". Les meilleurs ont tous connu des semaines difficiles au début. Ce qui compte, c'est que tu reviennes demain.</p>
                  </div>
                )}
                {stats.daysTracked > 0 && stats.callsMade / stats.daysTracked < 5 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">📉 Ta moyenne de conversations est faible ({Math.round(stats.callsMade / stats.daysTracked)}/jour)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Ton objectif minimum est de 5 conversations par jour en débutant, puis 10, puis 15. L'astuce : ne compte pas sur la motivation seule, <strong>crée une routine</strong>. 9h-10h : 5 appels de relance. 11h-13h : terrain (contacts physiques). 14h-15h : 5 appels à ta primo liste. 16h-17h : 5 appels de suivi. 18h-19h : dernier tour de terrain. Chaque créneau a sa fonction. Si tu n'as pas fait tes 5 conversations d'un créneau, tu ne passes pas au suivant. C'est comme ça que tu construis l'habitude. <strong>Objectif mois prochain : +2 conversations par jour par rapport à ce mois-ci.</strong></p>
                  </div>
                )}
                {stats.contactsApproached > 0 && stats.rdvR1Done > 0 && (stats.rdvR1Done / stats.contactsApproached * 100) < 10 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">🎯 Ton taux de conversion Contact → R1 est faible ({Math.round(stats.rdvR1Done / stats.contactsApproached * 100)}%)</p>
                    <p className="text-sm text-gray-700 leading-relaxed">La moyenne du réseau est de 15-20 %. Si tu es en dessous, c'est ta <strong>phrase d'accroche</strong> qu'il faut travailler. Teste ceci : "Bonjour, je suis [Prénom], conseiller immobilier sur [Secteur]. Je travaille actuellement avec un acquéreur très motivé qui cherche exactement ce type de bien sur votre rue — estimation patrimoniale gratuite, sans engagement, pour vous donner une idée de la valeur de votre patrimoine." Si le proprio dit "non, je ne vends pas" : "Je comprends tout à fait, ce n'est pas pour vendre aujourd'hui — c'est pour vous donner une info fiable sur la valeur de votre patrimoine. Ça sert toujours : pour vos assurances, un projet futur, une succession, ou simplement pour savoir ce que vous avez dans les mains. Ça prend 10 minutes." <strong>Objectif mois prochain : atteindre 15 % de conversion.</strong></p>
                  </div>
                )}
                {stats.mandatsSigned > 0 && stats.visitesDone > 0 && stats.offresWritten > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <p className="text-sm font-semibold text-green-700 mb-1">✅ Belle chaîne de conversion sur ce mois-ci !</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Tu as signé {stats.mandatsSigned} mandat{stats.mandatsSigned > 1 ? 's' : ''}, réalisé {stats.visitesDone} visites et rédigé {stats.offresWritten} offre{stats.offresWritten > 1 ? 's' : ''} — ta machine est en route. Analyse maintenant ce qui a marché : quelle rue a rapporté le plus ? Quelle approche de toquage a fonctionné ? Quel apporteur t'a envoyé le meilleur contact ? Double tes efforts sur ces gagnants. Et n'oublie pas : chaque mandat signé doit générer des visites en 48h, chaque visite doit créer l'urgence, et chaque offre doit être négociée avec détermination. <strong>Continue sur cette lancée, le mois prochain sera encore meilleur.</strong></p>
                  </div>
                )}
                {stats.contactsApproached > 0 && stats.rdvR1Done === 0 && (
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-amber-700 mb-1">🚪 Tu as fait {stats.contactsApproached} contacts physiques mais aucun R1 d'estimation</p>
                    <p className="text-sm text-gray-700 leading-relaxed">Tu toques des portes mais tu n'arrives pas à fixer de RDV d'estimation. Le problème vient probablement de ta transition. Après avoir présenté ta recherche acquéreur, n'attends pas que le proprio te demande une estimation — <strong>propose-la toi-même</strong> : "D'ailleurs, si un jour vous envisagiez de vendre — ou même pour vos assurances ou un projet — je peux vous remettre une estimation gratuite de la valeur de votre patrimoine. C'est sans engagement, et ça prend 10 minutes. Ça vous intéresserait ?" Si le proprio dit oui mais pas maintenant : "Parfait, je repasserai dans le secteur la semaine prochaine — est-ce que mercredi ou jeudi vous conviendrait ?" Note le nom, l'adresse, la date de relance dans ton CRM. <strong>Objectif mois prochain : 1 R1 pour 5 contacts physiques.</strong></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary text */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>Résumé :</strong> Sur {stats.daysTracked} jour{stats.daysTracked > 1 ? 's' : ''}, tu as fait <strong>{stats.callsMade} conversations</strong>, <strong>{stats.contactsApproached} contacts physiques</strong>, <strong>{stats.rdvR1Done} R1</strong>, <strong>{stats.rdvR2Done} R2</strong> et signé <strong>{stats.mandatsSigned} mandat{stats.mandatsSigned > 1 ? 's' : ''}</strong>.
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card><CardContent className="p-8 text-center text-gray-500">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>{isEs ? 'Ningún balance para este período.' : 'Aucun bilan pour cette période.'}</p>
          <p className="text-sm mt-1">{isEs ? '¡Empiece a completar sus balances diarios para ver sus estadísticas!' : 'Commence à remplir tes bilans quotidiens pour voir tes stats !'}</p>
        </CardContent></Card>
      )}
    </div>
  );
}
