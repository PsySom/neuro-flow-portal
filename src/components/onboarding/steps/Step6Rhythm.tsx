import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
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
  }, [data.chronotype, data.wakeTime]);

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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Ваш ритм жизни</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Когда вам комфортнее быть активным?
        </p>
      </div>

      <div className="space-y-6">
        {/* Chronotype */}
        <Card className="border-2">
          <CardContent className="pt-6 space-y-5">
            <div className="text-center">
              <Label className="text-lg font-bold">
                Когда вы чувствуете себя наиболее продуктивным?
              </Label>
            </div>

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
                className="grid gap-2"
              >
                {chronotypes.map((type) => (
                  <div
                    key={type.id}
                    className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                      data.chronotype === type.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
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
                      <span className="text-3xl">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{type.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Step6Rhythm;
