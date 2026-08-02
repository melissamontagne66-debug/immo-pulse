import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyCoach } from '@/hooks/useDailyCoach';
import type { UserProfile } from '@/types/profile';
import type { DailyResults } from '@/types';
import { MessageCircle, Target, Lightbulb, Flame, Moon, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface DailyCoachProps {
  currentDay: number;
  completedDays: string[];
  streak: number;
  profile: UserProfile;
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  excludeTypes?: string[];
  dailyResults?: DailyResults[];
}

const typeConfig = {
  morning: { color: 'bg-amber-50 border-amber-200', iconColor: 'text-amber-600', icon: MessageCircle },
  challenge: { color: 'bg-red-50 border-red-200', iconColor: 'text-red-600', icon: Target },
  tip: { color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', icon: Lightbulb },
  motivation: { color: 'bg-orange-50 border-orange-200', iconColor: 'text-orange-600', icon: Flame },
  evening: { color: 'bg-indigo-50 border-indigo-200', iconColor: 'text-indigo-600', icon: Moon },
};

export function DailyCoach({ currentDay, completedDays, streak, profile, dailyTargets, excludeTypes = [], dailyResults = [] }: DailyCoachProps) {
  const { messages, week } = useDailyCoach(currentDay, completedDays, streak, profile, dailyTargets, dailyResults);
  const [acceptedChallenge, setAcceptedChallenge] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const filteredMessages = messages.filter(m => !excludeTypes.includes(m.type));
  const displayedMessages = showAll ? filteredMessages : filteredMessages.slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-red-600" />
            Messages de ton coach
          </h3>
          <p className="text-sm text-gray-500">Ton coach personnel pour aujourd'hui</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="text-gray-500"
        >
          {showAll ? (
            <>Réduire <ChevronUp className="w-4 h-4 ml-1" /></>
          ) : (
            <>Voir tout <ChevronDown className="w-4 h-4 ml-1" /></>
          )}
        </Button>
      </div>

      {/* Messages */}
      {displayedMessages.map((msg) => {
        const config = typeConfig[msg.type];
        const isChallenge = msg.type === 'challenge';
        const isChallengeAccepted = isChallenge && acceptedChallenge;

        return (
          <Card
            key={msg.id}
            className={`${config.color} border transition-all duration-200 hover:shadow-sm`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{msg.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-sm ${config.iconColor}`}>
                      {msg.title}
                    </h4>
                    {isChallengeAccepted && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                        <Check className="w-3 h-3" /> Accepté !
                      </span>
                    )}
                  </div>

                  <p className={`text-sm mt-1.5 leading-relaxed ${
                    msg.type === 'motivation' ? 'text-orange-800 font-medium' : 'text-gray-700'
                  }`}>
                    {msg.message}
                  </p>

                  {/* Action button for challenge */}
                  {isChallenge && !isChallengeAccepted && (
                    <Button
                      onClick={() => setAcceptedChallenge(true)}
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs"
                      size="sm"
                    >
                      <Target className="w-3.5 h-3.5 mr-1" />
                      {msg.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Récap semaine */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-400">
          Semaine {week} • {completedDays.length} actions completées • Série : {streak} jours
        </p>
      </div>
    </div>
  );
}
