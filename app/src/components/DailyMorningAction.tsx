import { useDailyCoach } from '@/hooks/useDailyCoach';
import { Card, CardContent } from '@/components/ui/card';
import { Sunrise } from 'lucide-react';
import type { UserProfile } from '@/types/profile';
import type { DailyResults } from '@/types';

interface DailyMorningActionProps {
  currentDay: number;
  profile: UserProfile;
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  dailyResults?: DailyResults[];
}

export function DailyMorningAction({ currentDay, profile, dailyTargets, dailyResults }: DailyMorningActionProps) {
  const { messages } = useDailyCoach(currentDay, [], 0, profile, dailyTargets, dailyResults);
  // Get the first morning message (action du jour), skip welcome if present
  const morningMsg = messages.find(m => m.type === 'morning' && !m.title.includes('Bienvenue'));

  if (!morningMsg) return null;

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Sunrise className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">{morningMsg.title}</p>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">{morningMsg.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
