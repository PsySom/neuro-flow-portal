import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Sunrise, Sun, Moon, RefreshCw, Clock, Bell, Lightbulb } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step6RhythmProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const chronotypes = [
  { id: 'morning', label: 'Утром (жаворонок)', icon: '🌅', description: 'Максимум энергии утром' },
  { id: 'day', label: 'Днём', icon: '☀️', description: 'Активен в середине дня' },
  { id: 'evening', label: 'Вечером (сова)', icon: '🌙', description: 'Продуктивен вечером' },
  { id: 'varies', label: 'По-разному', icon: '🔄', description: 'Зависит от дня' }
];

const timeCommitments = [
  { id: '5-10', label: '5-10 минут в день', description: 'Быстрые практики' },
  { id: '15-20', label: '15-20 минут в день', description: 'Умеренная нагрузка' },
  { id: '30-45', label: '30-45 минут в день', description: 'Глубокая работа' },
  { id: '60+', label: '60+ минут в день', description: 'Максимальное погружение' }
];

const reminderOptions = [
  { id: '1-2', label: '1-2 раза в день', description: 'Утром и вечером' },
  { id: '3-4', label: '3-4 раза в день', description: 'Регулярные напоминания' },
  { id: 'on-demand', label: 'По необходимости', description: 'Когда нужна поддержка' },
  { id: 'minimal', label: 'Минимум уведомлений', description: 'Только важное' }
];

const Step6Rhythm: React.FC<Step6RhythmProps> = ({ data, updateData }) => {
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Smart recommendations based on previous answers
  useEffect(() => {
    // Auto-suggest chronotype based on sleep time
    if (!data.chronotype && data.wakeTime) {
      const wakeHour = parseInt(data.wakeTime.split(':')[0]);
      if (wakeHour <= 7) {
        setShowRecommendation(true);
      }
    }

    // Auto-suggest reminders based on time commitment
    if (data.timeCommitment && !data.reminders) {
      if (data.timeCommitment === '5-10') {
        updateData({ reminders: '1-2' });
      }
    }

    // Auto-suggest reminders based on chronotype
    if (data.chronotype === 'evening' && !data.reminders) {
      updateData({ reminders: '1-2' });
    }
  }, [data.chronotype, data.timeCommitment, data.wakeTime]);

  const getChronotypeRecommendation = () => {
    if (!data.wakeTime) return null;
    const wakeHour = parseInt(data.wakeTime.split(':')[0]);
    if (wakeHour <= 7) {
      return 'morning';
    } else if (wakeHour >= 9) {
      return 'evening';
    }
    return 'day';
  };

  const recommendedChronotype = getChronotypeRecommendation();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">🌅 Когда вы наиболее активны?</h2>
        <p className="text-muted-foreground">
          Давайте подберем оптимальное время для практик
        </p>
      </div>

      <div className="space-y-6">
        {/* Chronotype */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-primary" />
                Ваш хронотип:
              </Label>

              {showRecommendation && recommendedChronotype && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-900 dark:text-blue-300">
                    На основе вашего времени пробуждения ({data.wakeTime}) мы рекомендуем "{chronotypes.find(c => c.id === recommendedChronotype)?.label}"
                  </p>
                </div>
              )}

              <RadioGroup
                value={data.chronotype}
                onValueChange={(value) => updateData({ chronotype: value })}
                className="space-y-3"
              >
                {chronotypes.map((type) => (
                  <div
                    key={type.id}
                    className={`relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                      data.chronotype === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <RadioGroupItem
                      value={type.id}
                      id={`chronotype-${type.id}`}
                      className="mt-0"
                    />
                    <Label
                      htmlFor={`chronotype-${type.id}`}
                      className="cursor-pointer flex items-center gap-3 flex-1"
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium">{type.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Time Commitment */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                ⏱ Сколько времени готовы уделять?
              </Label>

              <RadioGroup
                value={data.timeCommitment}
                onValueChange={(value) => updateData({ timeCommitment: value })}
                className="space-y-3"
              >
                {timeCommitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className={`relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                      data.timeCommitment === commitment.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <RadioGroupItem
                      value={commitment.id}
                      id={`time-${commitment.id}`}
                      className="mt-0"
                    />
                    <Label
                      htmlFor={`time-${commitment.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <p className="font-medium">{commitment.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {commitment.description}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                🔔 Как часто получать напоминания?
              </Label>

              <RadioGroup
                value={data.reminders}
                onValueChange={(value) => updateData({ reminders: value })}
                className="space-y-3"
              >
                {reminderOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`relative flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                      data.reminders === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`reminder-${option.id}`}
                      className="mt-0"
                    />
                    <Label
                      htmlFor={`reminder-${option.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Step6Rhythm;
