import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { onboardingPlan } from '@/data/onboardingPlan';
import { categories } from '@/data/knowledgeBase';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekViewProps {
  currentDay: number;
  completedDays: string[];
  onCompleteDay: (dayId: string) => void;
  onUncompleteDay: (dayId: string) => void;
  onDayChange: (day: number) => void;
}

export function WeekView({
  currentDay,
  completedDays,
  onCompleteDay,
  onUncompleteDay,
  onDayChange,
}: WeekViewProps) {
  // Find the week for currentDay
  let currentWeekIndex = 0;
  let currentMonthIndex = 0;
  const allWeeks: { month: number; week: typeof onboardingPlan[0]['weeks'][0] }[] = [];

  onboardingPlan.forEach((month, mi) => {
    month.weeks.forEach((week) => {
      allWeeks.push({ month: mi, week });
      if (week.days.some(d => d.day === currentDay)) {
        currentWeekIndex = allWeeks.length - 1;
        currentMonthIndex = mi;
      }
    });
  });

  const currentWeekData = allWeeks[currentWeekIndex];
  const weekProgress = currentWeekData ? Math.round(
    (currentWeekData.week.days.filter(d => completedDays.includes(d.id)).length / currentWeekData.week.days.length) * 100
  ) : 0;

  const getCategoryStyle = (cat: string) => {
    const catInfo = categories.find(c => c.id === cat);
    return catInfo || { label: cat, color: 'bg-gray-500' };
  };

  const goToPrevWeek = () => {
    if (currentWeekIndex > 0) {
      const prevWeek = allWeeks[currentWeekIndex - 1];
      if (prevWeek) {
        onDayChange(prevWeek.week.days[0].day);
      }
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex < allWeeks.length - 1) {
      const nextWeek = allWeeks[currentWeekIndex + 1];
      if (nextWeek) {
        onDayChange(nextWeek.week.days[0].day);
      }
    }
  };

  if (!currentWeekData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={currentWeekIndex <= 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Semaine {currentWeekData.week.week}
            </h2>
            <p className="text-gray-500">{currentWeekData.week.title} — {onboardingPlan[currentMonthIndex]?.title}</p>
          </div>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={currentWeekIndex >= allWeeks.length - 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{weekProgress}% completé</p>
          <p className="text-xs text-gray-500">{currentWeekData.week.days.filter(d => completedDays.includes(d.id)).length} / {currentWeekData.week.days.length} actions</p>
        </div>
      </div>

      {/* Week Progress Bar */}
      <Progress value={weekProgress} className="h-3" />

      {/* Week Theme */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-red-800">Thème de la semaine</p>
          <p className="text-red-700">{currentWeekData.week.theme}</p>
        </CardContent>
      </Card>

      {/* Days Grid */}
      <div className="space-y-4">
        {currentWeekData.week.days.map(day => {
          const isCompleted = completedDays.includes(day.id);
          const isToday = day.day === currentDay;
          const catStyle = getCategoryStyle(day.category);

          return (
            <Card
              key={day.id}
              className={`transition-all duration-200 ${
                isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''
              } ${isCompleted ? 'border-green-300 bg-green-50/30' : 'hover:shadow-md'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Day Number */}
                  <button
                    onClick={() => isCompleted ? onUncompleteDay(day.id) : onCompleteDay(day.id)}
                    className="flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">Jour {day.day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${catStyle.color}`}>
                        {catStyle.label}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                          Aujourd'hui
                        </span>
                      )}
                    </div>
                    <h3 className={`font-semibold text-gray-900 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {day.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{day.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">⏱️ {day.estimatedTime}</span>
                      <button
                        onClick={() => onDayChange(day.day)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Voir le détail →
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
