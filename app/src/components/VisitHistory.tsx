import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { VisitReport, VisitStats, VisitStatus } from '@/types';
import { BarChart3, ArrowLeft, Home, Calendar, Trash2, ChevronDown, ChevronUp, TrendingUp, Edit3, PieChart, MessageSquare, Hash } from 'lucide-react';

interface VisitHistoryProps {
  visits: VisitReport[];
  stats: VisitStats;
  onBack: () => void;
  onDeleteVisit: (id: string) => void;
  onDeleteProperty: (address: string) => void;
  onUpdateVisit: (id: string, updates: Partial<VisitReport>) => void;
}

const statusLabels: Record<string, { label: string; labelEs: string; color: string }> = {
  intéressé: { label: 'Intéressé', labelEs: 'Interesado', color: 'bg-green-500' },
  réflexion: { label: 'Réflexion', labelEs: 'Pensándoselo', color: 'bg-amber-500' },
  négatif: { label: 'Négatif', labelEs: 'Negativo', color: 'bg-red-500' },
  offre: { label: 'Offre', labelEs: 'Oferta', color: 'bg-blue-500' },

};

// Langue lue depuis la session (iad-coach-session) puis le profil local
// (iad-coach-profile-{email}) — même pattern que readAgentInfo dans
// VisitReportWriter, car ce composant ne reçoit pas profile en props.
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

export function VisitHistory({ visits, stats, onBack, onDeleteVisit, onDeleteProperty, onUpdateVisit }: VisitHistoryProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const isEs = readIsEs();
  const statusLabel = (s: string) => {
    const entry = statusLabels[s];
    return entry ? (isEs ? entry.labelEs : entry.label) : s;
  };

  const propertyList = Object.entries(stats.byProperty).sort((a, b) => b[1].length - a[1].length);

  const maxObjCount = stats.topBuyerObjections.length > 0 ? stats.topBuyerObjections[0].count : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-red-600" />
              {isEs ? 'Historial de visitas' : 'Historique des visites'}
            </h2>
            <p className="text-gray-500 mt-1">{visits.length} {isEs ? 'visita' : 'visite'}{visits.length > 1 ? 's' : ''} {isEs ? 'registrada' : 'enregistrée'}{visits.length > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(stats.byStatus).map(([status, count]) => (
          <Card key={status}><CardContent className="p-3 text-center">
            <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${statusLabels[status]?.color || 'bg-gray-400'}`} />
            <p className="text-xl font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500">{statusLabel(status)}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Chart: objections récurrentes */}
      {stats.topBuyerObjections.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              {isEs ? 'Los argumentos que más se repiten entre los compradores' : 'Arguments qui reviennent le plus chez les acheteurs'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{isEs ? 'Utilizar estas estadísticas en mis citas de seguimiento con los vendedores para justificar ajustes.' : 'Utiliser ces stats lors de mes RDV de suivi avec les vendeurs pour justifier des ajustements.'}</p>
            <div className="space-y-3">
              {stats.topBuyerObjections.map((obj, i) => {
                const pct = Math.round((obj.count / maxObjCount) * 100);
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500'];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-32 truncate">{obj.objection}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className={`${colors[i % colors.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{obj.count}x</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graphique : répartition des statuts par bien */}
      {propertyList.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              {isEs ? 'Resumen de las opiniones por vendedor' : 'Aperçu des retours par vendeur'}
            </h3>
            <div className="space-y-4">
              {propertyList.slice(0, 10).map(([address, propertyVisits]) => {
                const statusCounts = { intéressé: 0, réflexion: 0, négatif: 0, offre: 0 };
                propertyVisits.forEach(v => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
                const total = propertyVisits.length;
                return (
                  <div key={address} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-700 truncate flex-1">{address}</p>
                      <p className="text-xs text-gray-500 ml-2">{total} {isEs ? 'visita' : 'visite'}{total > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
                      {statusCounts.intéressé > 0 && (
                        <div className="bg-green-500 h-full" style={{ width: `${(statusCounts.intéressé / total) * 100}%` }} title={`${statusLabel('intéressé')}: ${statusCounts.intéressé}`} />
                      )}
                      {statusCounts.réflexion > 0 && (
                        <div className="bg-amber-500 h-full" style={{ width: `${(statusCounts.réflexion / total) * 100}%` }} title={`${statusLabel('réflexion')}: ${statusCounts.réflexion}`} />
                      )}
                      {statusCounts.négatif > 0 && (
                        <div className="bg-red-500 h-full" style={{ width: `${(statusCounts.négatif / total) * 100}%` }} title={`${statusLabel('négatif')}: ${statusCounts.négatif}`} />
                      )}
                      {statusCounts.offre > 0 && (
                        <div className="bg-blue-500 h-full" style={{ width: `${(statusCounts.offre / total) * 100}%` }} title={`${statusLabel('offre')}: ${statusCounts.offre}`} />
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      {statusCounts.intéressé > 0 && <span className="text-green-600">● {statusLabel('intéressé')} {statusCounts.intéressé}</span>}
                      {statusCounts.réflexion > 0 && <span className="text-amber-600">● {statusLabel('réflexion')} {statusCounts.réflexion}</span>}
                      {statusCounts.négatif > 0 && <span className="text-red-600">● {statusLabel('négatif')} {statusCounts.négatif}</span>}
                      {statusCounts.offre > 0 && <span className="text-blue-600">● {statusLabel('offre')} {statusCounts.offre}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Légende */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> {statusLabel('intéressé')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {statusLabel('réflexion')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {statusLabel('négatif')}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> {statusLabel('offre')}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visits by property */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Home className="w-5 h-5 text-blue-500" />
          {isEs ? 'Visitas por inmueble' : 'Visites par bien'}
        </h3>

        {propertyList.length === 0 && (
          <Card><CardContent className="p-8 text-center text-gray-500">{isEs ? 'Aún no hay ninguna visita registrada. Completar mi primer informe de visita.' : 'Aucune visite enregistrée encore. Remplir mon premier compte rendu de visite.'}</CardContent></Card>
        )}

        <div className="space-y-3">
          {propertyList.map(([address, propertyVisits]) => (
            <Card key={address} className="overflow-hidden">
              <div
                className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedProperty(selectedProperty === address ? null : address)}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{address}</p>
                    <p className="text-xs text-gray-500">{propertyVisits.length} {isEs ? 'visita(s) · Vendedor: ' : 'visite(s) · Vendeur : '}{propertyVisits[0]?.sellerName || (isEs ? 'No indicado' : 'Non renseigné')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{propertyVisits.length} {isEs ? 'visitas' : 'visites'}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm(isEs ? '¿Eliminar este inmueble y todas sus visitas?' : 'Supprimer ce bien et toutes ses visites ?')) onDeleteProperty(address); }}
                    className="text-gray-300 hover:text-red-500 p-1"
                    title={isEs ? 'Eliminar este inmueble' : 'Supprimer ce bien'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {selectedProperty === address ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {selectedProperty === address && (
                <div className="divide-y divide-gray-100">
                  {/* Récap visuel des retours pour ce bien */}
                  {propertyVisits.length > 1 && (
                    <div className="p-4 bg-amber-50 border-b border-amber-100">
                      <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        {isEs ? 'Resumen visual de las opiniones' : 'Récap visuel des retours'} — {propertyVisits.length} {isEs ? 'visitas' : 'visites'}
                      </h4>
                      {/* Distribution des statuts */}
                      <div className="mb-3">
                        <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
                          {(() => {
                            const sc = { intéressé: 0, réflexion: 0, négatif: 0, offre: 0 };
                            propertyVisits.forEach(v => sc[v.status]++);
                            const t = propertyVisits.length;
                            return (
                              <>
                                {sc.intéressé > 0 && <div className="bg-green-500 h-full" style={{ width: `${(sc.intéressé / t) * 100}%` }} title={statusLabel('intéressé')} />}
                                {sc.réflexion > 0 && <div className="bg-amber-500 h-full" style={{ width: `${(sc.réflexion / t) * 100}%` }} title={statusLabel('réflexion')} />}
                                {sc.négatif > 0 && <div className="bg-red-500 h-full" style={{ width: `${(sc.négatif / t) * 100}%` }} title={statusLabel('négatif')} />}
                                {sc.offre > 0 && <div className="bg-blue-500 h-full" style={{ width: `${(sc.offre / t) * 100}%` }} title={statusLabel('offre')} />}
                              </>
                            );
                          })()}
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                          {(() => {
                            const sc = { intéressé: 0, réflexion: 0, négatif: 0, offre: 0 };
                            propertyVisits.forEach(v => sc[v.status]++);
                            return (
                              <>
                                {sc.intéressé > 0 && <span className="text-green-600">● {statusLabel('intéressé')} {sc.intéressé}</span>}
                                {sc.réflexion > 0 && <span className="text-amber-600">● {statusLabel('réflexion')} {sc.réflexion}</span>}
                                {sc.négatif > 0 && <span className="text-red-600">● {statusLabel('négatif')} {sc.négatif}</span>}
                                {sc.offre > 0 && <span className="text-blue-600">● {statusLabel('offre')} {sc.offre}</span>}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      {/* Récurrence des retours */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'priceFeedback', label: isEs ? '💰 Precio' : '💰 Prix', color: 'text-red-700', bg: 'bg-red-50' },
                          { key: 'locationFeedback', label: isEs ? '📍 Ubicación' : '📍 Emplacement', color: 'text-blue-700', bg: 'bg-blue-50' },
                          { key: 'workFeedback', label: isEs ? '🔧 Obras' : '🔧 Travaux', color: 'text-amber-700', bg: 'bg-amber-50' },
                          { key: 'generalFeedback', label: isEs ? '📝 General' : '📝 Général', color: 'text-gray-700', bg: 'bg-gray-50' },
                        ].map(cat => {
                          const feedbacks = propertyVisits
                            .filter(v => v[cat.key as keyof VisitReport] as string)
                            .map(v => v[cat.key as keyof VisitReport] as string);
                          const uniqueFb = Array.from(new Set(feedbacks));
                          if (uniqueFb.length === 0) return null;
                          return (
                            <div key={cat.key} className={`${cat.bg} rounded p-2`}>
                              <p className={`text-xs font-semibold ${cat.color} flex items-center gap-1`}>
                                <MessageSquare className="w-3 h-3" />
                                {cat.label} ({uniqueFb.length}x)
                              </p>
                              <div className="mt-1 space-y-1">
                                {uniqueFb.slice(0, 3).map((fb, i) => (
                                  <p key={i} className="text-[10px] text-gray-600 truncate" title={fb}>• {fb}</p>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Tendance globale */}
                      {(() => {
                        const interestedCount = propertyVisits.filter(v => v.status === 'intéressé' || v.status === 'offre').length;
                        const pct = Math.round((interestedCount / propertyVisits.length) * 100);
                        let trendText = '';
                        let trendColor = '';
                        if (pct >= 60) { trendText = isEs ? 'Tendencia positiva — El inmueble gusta a los compradores' : 'Tendance positive — Le bien plaît aux acheteurs'; trendColor = 'text-green-700'; }
                        else if (pct >= 30) { trendText = isEs ? 'Tendencia mixta — Ajustes posibles' : 'Tendance mitigée — Ajustements possibles'; trendColor = 'text-amber-700'; }
                        else { trendText = isEs ? 'Tendencia negativa — Se recomienda una cita de seguimiento con el vendedor' : 'Tendance négative — RDV de suivi vendeur recommandé'; trendColor = 'text-red-700'; }
                        return (
                          <div className="mt-3 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <p className={`text-xs font-medium ${trendColor}`}>{trendText} ({pct}% {isEs ? 'de interés' : "d'intérêt"})</p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {propertyVisits.map(visit => (
                    <div key={visit.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{new Date(visit.date).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            {editingStatus === visit.id ? (
                              <div className="flex items-center gap-1">
                                {(['intéressé', 'réflexion', 'négatif', 'offre'] as VisitStatus[]).map(s => (
                                  <button
                                    key={s}
                                    onClick={() => { onUpdateVisit(visit.id, { status: s }); setEditingStatus(null); }}
                                    className={`text-xs px-2 py-0.5 rounded-full text-white transition-all ${statusLabels[s]?.color || 'bg-gray-400'} ${visit.status === s ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
                                  >
                                    {statusLabel(s)}
                                  </button>
                                ))}
                                <button onClick={() => setEditingStatus(null)} className="text-xs text-gray-400 hover:text-gray-600 ml-1">{isEs ? 'Cancelar' : 'Annuler'}</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${statusLabels[visit.status]?.color || 'bg-gray-400'}`}>{statusLabel(visit.status)}</span>
                                <button onClick={() => setEditingStatus(visit.id)} className="text-gray-300 hover:text-blue-500 p-0.5" title={isEs ? 'Cambiar el estado' : 'Changer le statut'}><Edit3 className="w-3 h-3" /></button>
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{isEs ? 'Comprador: ' : 'Acquéreur : '}{visit.buyerName || (isEs ? 'No indicado' : 'Non renseigné')}</p>

                          {/* Categorized feedback */}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {visit.priceFeedback && (
                              <div className="bg-red-50 rounded p-2">
                                <p className="text-xs font-medium text-red-700">{isEs ? '💰 Precio' : '💰 Prix'}</p>
                                <p className="text-xs text-red-600">{visit.priceFeedback}</p>
                              </div>
                            )}
                            {visit.locationFeedback && (
                              <div className="bg-blue-50 rounded p-2">
                                <p className="text-xs font-medium text-blue-700">{isEs ? '📍 Ubicación' : '📍 Emplacement'}</p>
                                <p className="text-xs text-blue-600">{visit.locationFeedback}</p>
                              </div>
                            )}
                            {visit.workFeedback && (
                              <div className="bg-amber-50 rounded p-2">
                                <p className="text-xs font-medium text-amber-700">{isEs ? '🔧 Obras' : '🔧 Travaux'}</p>
                                <p className="text-xs text-amber-600">{visit.workFeedback}</p>
                              </div>
                            )}
                            {visit.generalFeedback && (
                              <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs font-medium text-gray-700">{isEs ? '📝 General' : '📝 Général'}</p>
                                <p className="text-xs text-gray-600">{visit.generalFeedback}</p>
                              </div>
                            )}
                          </div>

                          {/* Expand gênerated message */}
                          {visit.generatedMessage && (
                            <div className="mt-2">
                              <button onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)} className="text-xs text-blue-600 hover:underline">
                                {expandedVisit === visit.id
                                  ? (isEs ? 'Ocultar el mensaje' : 'Masquer le message')
                                  : (isEs ? 'Ver el mensaje enviado al vendedor' : 'Voir le message envoyé au vendeur')}
                              </button>
                              {expandedVisit === visit.id && (
                                <div className="mt-2 bg-white border border-gray-200 rounded p-3 text-xs text-gray-700 whitespace-pre-line">{visit.generatedMessage}</div>
                              )}
                            </div>
                          )}
                        </div>
                        <button onClick={() => onDeleteVisit(visit.id)} className="text-gray-300 hover:text-red-500 ml-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
