import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyResults } from '@/types';
import type { UserProfile } from '@/types/profile';
import type { Sale } from '@/hooks/useSales';
import { BilanHistory } from './BilanHistory';
import { parseLocalDateKey, formatEuro } from '@/lib/utils';
import { ClipboardCheck, Phone, Calendar, FileCheck, Star, MessageSquare, Clock, BarChart3 } from 'lucide-react';

interface HistoryViewProps {
  dailyResults: DailyResults[];
  profile: UserProfile;
  sales: Sale[];
}

export function HistoryView({ dailyResults, profile, sales }: HistoryViewProps) {
  const [showStats, setShowStats] = useState(false);
  const isEs = profile.language === 'es';

  if (showStats) {
    return <BilanHistory dailyResults={dailyResults} onBack={() => setShowStats(false)} />;
  }

  if (dailyResults.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardCheck className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{isEs ? 'Ningún balance por el momento' : 'Aucun bilan pour le moment'}</h3>
        <p className="text-gray-500 mt-2">{isEs ? 'Complete su primer balance del día para ver su historial aquí.' : 'Remplis ton premier bilan de journée pour voir ton historique ici.'}</p>
        <p className="text-sm text-gray-400 mt-1">{isEs ? 'Sus balances y respuestas se guardan en su dispositivo y se sincronizan con su cuenta.' : 'Tes bilans et réponses sont enregistrés sur ton appareil et synchronisés sur ton compte.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isEs ? 'Historial de sus balances' : 'Historique de tes bilans'}</h2>
          <p className="text-gray-500 mt-1">{dailyResults.length} {isEs ? 'balance' : 'bilan'}{dailyResults.length > 1 ? 's' : ''} {isEs ? 'registrado' : 'enregistré'}{dailyResults.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowStats(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          {isEs ? 'Vista por semana / mes' : 'Vue par semaine / mois'}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isEs ? 'Conversaciones' : 'Conversations', value: dailyResults.reduce((s, r) => s + r.callsMade, 0), icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isEs ? 'R1 hechos' : 'R1 faits', value: dailyResults.reduce((s, r) => s + r.rdvR1Done, 0), icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
          { label: isEs ? 'R2 hechos' : 'R2 faits', value: dailyResults.reduce((s, r) => s + r.rdvR2Done, 0), icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: isEs ? 'Mandatos' : 'Mandats', value: dailyResults.reduce((s, r) => s + r.mandatsSigned, 0), icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(stat => (
          <Card key={stat.label}><CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} p-2.5 rounded-lg`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div><p className="text-lg font-bold text-gray-900">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {/* List of daily results */}
      <div className="space-y-4">
        {dailyResults.map((result, index) => (
          <Card key={result.date} className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-red-600" />
                  {parseLocalDateKey(result.date).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <span className="text-xs text-gray-400">{isEs ? 'Balance' : 'Bilan'} #{dailyResults.length - index}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Numbers */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">{result.callsMade}</p>
                  <p className="text-xs text-blue-500">{isEs ? 'Conversaciones' : 'Conversations'}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-700">{result.contactsApproached}</p>
                  <p className="text-xs text-green-500">{isEs ? 'Contactos' : 'Contacts'}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-700">{result.rdvR1Done}</p>
                  <p className="text-xs text-purple-500">{isEs ? 'R1 hechos' : 'R1 faits'}</p>
                </div>
                <div className="text-center p-2 bg-indigo-50 rounded-lg">
                  <p className="text-lg font-bold text-indigo-700">{result.rdvR2Done}</p>
                  <p className="text-xs text-indigo-500">{isEs ? 'R2 hechos' : 'R2 faits'}</p>
                </div>
                <div className="text-center p-2 bg-teal-50 rounded-lg">
                  <p className="text-lg font-bold text-teal-700">{result.mandatsSigned}</p>
                  <p className="text-xs text-teal-500">{isEs ? 'Mandatos' : 'Mandats'}</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-700">{result.visitesDone}</p>
                  <p className="text-xs text-orange-500">{isEs ? 'Visitas' : 'Visites'}</p>
                </div>
              </div>

              {/* Ventes du jour (enregistrées via le calculateur de commission) */}
              {sales.filter(s => s.date === result.date).map(sale => (
                <p key={sale.id} className="text-xs text-gray-700 mb-3">
                  💰 {isEs ? 'Venta registrada' : 'Vente enregistrée'}&nbsp;: {sale.name} — {formatEuro(sale.net)} {isEs ? 'neto' : 'net'}
                </p>
              ))}

              {/* Prospection time */}
              {result.prospectionTime && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Clock className="w-3 h-3" />
                  {isEs ? 'Prospección' : 'Prospection'} : {result.prospectionTime === 'matin' ? '11 h – 13 h 30' : result.prospectionTime === 'soir' ? '17 h – 19 h' : result.prospectionTime === 'les-deux' ? '11 h – 13 h 30 + 17 h – 19 h' : (isEs ? 'Otro horario' : 'Autre horaire')}
                </div>
              )}

              {/* Wins & Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.wins && (
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-yellow-700 mb-1">{isEs ? 'Victorias' : 'Victoires'}</p>
                    <p className="text-sm text-yellow-800">{result.wins}</p>
                  </div>
                )}
                {result.challenges && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">{isEs ? 'Dificultades' : 'Difficultés'}</p>
                    <p className="text-sm text-red-800">{result.challenges}</p>
                  </div>
                )}
              </div>

              {/* Mood */}
              {result.mood > 0 && (
                <div className="flex items-center gap-1 mt-3">
                  <Star className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{isEs ? 'Estado de ánimo' : 'Humeur'} : {result.mood}/5</p>
                </div>
              )}

              {/* Coach question */}
              {result.coachQuestion && (
                <div className="mt-3 bg-red-50 rounded-lg p-3 border border-red-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3 h-3 text-red-500" />
                    <p className="text-xs font-semibold text-red-700">{isEs ? 'Pregunta para el coach' : 'Question pour le coach'} :</p>
                  </div>
                  <p className="text-sm text-red-800 mt-1">{result.coachQuestion}</p>
                </div>
              )}

              {/* Notes */}
              {result.notes && (
                <div className="mt-3 text-xs text-gray-500">
                  <p className="font-medium">{isEs ? 'Notas' : 'Notes'} :</p>
                  <p className="whitespace-pre-line">{result.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
