import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSmartDashboard } from '@/hooks/useSmartDashboard';
import type { UserProfile } from '@/types/profile';
import { getMonthlyMandatTarget } from '@/types/profile';
import type { UserProgress, DailyResults } from '@/types';
import type { WeekPlan } from '@/types';
import { Flame, Target, AlertTriangle, ArrowRight, Sunrise } from 'lucide-react';
import { Phone, Calendar, FileCheck, Home, DoorOpen } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  completionRate: number;
  currentDay: number;
  profile: UserProfile;
  dailyResults: DailyResults[];
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  currentWeek: WeekPlan;
  onNavigate: (tab: string) => void;
  onSetMonthlyGoal: () => void;
}

export function Dashboard({ progress, currentDay, profile, dailyTargets, dailyResults, onNavigate, onSetMonthlyGoal }: DashboardProps) {
  const { insights } = useSmartDashboard(dailyResults, profile, currentDay, progress.streak);
  const alertes = insights.filter(i => i.type === 'alerte');

  // Objectif mensuel de mandats selon le niveau
  const monthsSinceStart = useMemo(() => {
    const start = new Date(profile.startDate);
    const now = new Date();
    return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  }, [profile.startDate]);

  const monthlyMandatTarget = getMonthlyMandatTarget(profile.expérienceLevel, monthsSinceStart);

  // Mandats signés ce mois-ci (depuis le 1er du mois)
  const mandatsThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    return dailyResults
      .filter(r => r.date >= monthStart)
      .reduce((sum, r) => sum + r.mandatsSigned, 0);
  }, [dailyResults]);

  // Objectifs quotidiens (sans mandat qui est maintenant mensuel)
  const dailyObjectives = [
    { label: 'Conversations', value: dailyTargets.calls, icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Contacts physiques', value: dailyTargets.contactsPhysiques, icon: DoorOpen, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { label: 'R1', value: dailyTargets.rdvR1, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'R2', value: dailyTargets.rdvR2, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { label: 'Visites', value: dailyTargets.visites, icon: Home, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  ];

  // Progression mandats par semaine
  const mandatProgressPct = monthlyMandatTarget > 0 ? Math.min(100, Math.round((mandatsThisMonth / monthlyMandatTarget) * 100)) : 0;
  const weekTarget = Math.ceil(monthlyMandatTarget / 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.firstName ? `Bienvenue ${profile.firstName} !` : 'Objectifs du jour'}
          </h2>
          <p className="text-gray-500 mt-1">Jour {currentDay}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSetMonthlyGoal}
            className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Target className="w-4 h-4" />
            CA : {(profile.currentMonthGoal.caTarget / 1000).toFixed(0)}k€
          </button>
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
            <Flame className="w-5 h-5" />
            <span className="font-semibold text-sm">{progress.streak} jours</span>
          </div>
        </div>
      </div>

      {/* Objectif mensuel de mandats — carte principale */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-semibold text-purple-800">Objectif mandats ce mois-ci</p>
            </div>
            <p className="text-xs text-purple-600 bg-white px-2 py-0.5 rounded-full font-medium">{mandatsThisMonth} / {monthlyMandatTarget}</p>
          </div>
          {/* Barre de progression */}
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${mandatProgressPct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-xs text-purple-600">{mandatProgressPct}% atteint</p>
            <p className="text-xs text-purple-500">~{weekTarget} mandat{weekTarget > 1 ? 's' : ''}/semaine</p>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs du jour — petites cartes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tes objectifs aujourd'hui</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {dailyObjectives.map(obj => (
            <Card key={obj.label} className={`${obj.border} ${obj.bg} hover:shadow-md transition-shadow cursor-pointer`} onClick={() => onNavigate('today')}>
              <CardContent className="p-4 text-center">
                <obj.icon className={`w-6 h-6 ${obj.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{obj.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{obj.label}/jour</p>
              </CardContent>
            </Card>
          ))}
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
