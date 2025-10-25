import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Target, Search } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step3GoalsAndChallengesProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const primaryGoals = [
  { id: 'anxiety-stress', label: 'Справиться с тревогой и стрессом' },
  { id: 'mood', label: 'Улучшить настроение' },
  { id: 'procrastination', label: 'Победить прокрастинацию' },
  { id: 'sleep', label: 'Наладить сон' },
  { id: 'productivity', label: 'Повысить продуктивность' },
  { id: 'mindfulness', label: 'Развить осознанность' },
  { id: 'relationships', label: 'Улучшить отношения' },
  { id: 'balance', label: 'Найти баланс в жизни' },
  { id: 'other', label: 'Другое' }
];

const challengeAreas = [
  { id: 'anxiety', label: 'Тревога и беспокойство' },
  { id: 'stress', label: 'Стресс и напряжение' },
  { id: 'procrastination', label: 'Прокрастинация' },
  { id: 'self-esteem', label: 'Низкая самооценка' },
  { id: 'sleep-issues', label: 'Проблемы со сном' },
  { id: 'low-energy', label: 'Недостаток энергии' },
  { id: 'concentration', label: 'Трудности с концентрацией' },
  { id: 'mood-swings', label: 'Перепады настроения' },
  { id: 'loneliness', label: 'Одиночество' },
  { id: 'burnout', label: 'Выгорание' },
  { id: 'relationship-issues', label: 'Проблемы в отношениях' }
];

const MAX_CHALLENGES = 3;

const Step3GoalsAndChallenges: React.FC<Step3GoalsAndChallengesProps> = ({
  data,
  updateData
}) => {
  const [otherGoalText, setOtherGoalText] = useState('');
  const showOtherInput = data.primaryGoal === 'other';

  const handleChallengeToggle = (challengeId: string) => {
    const newChallenges = data.challenges.includes(challengeId)
      ? data.challenges.filter(c => c !== challengeId)
      : [...data.challenges, challengeId];
    
    // Limit to MAX_CHALLENGES
    if (newChallenges.length <= MAX_CHALLENGES) {
      updateData({ challenges: newChallenges });
    }
  };

  const isChallengeDisabled = (challengeId: string) => {
    return !data.challenges.includes(challengeId) && data.challenges.length >= MAX_CHALLENGES;
  };

  const handlePrimaryGoalChange = (value: string) => {
    updateData({ primaryGoal: value });
    if (value !== 'other') {
      setOtherGoalText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Ваши цели</h2>
        <p className="text-muted-foreground">
          Расскажите, что для вас важнее всего
        </p>
      </div>

      <div className="space-y-6">
        {/* Block 1: Primary Goal */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <Label className="text-base font-semibold">
              🎯 Что привело вас в Mental Balance?
            </Label>
          </div>
          
          <RadioGroup
            value={data.primaryGoal}
            onValueChange={handlePrimaryGoalChange}
          >
            {primaryGoals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-2">
                <RadioGroupItem value={goal.id} id={`goal-${goal.id}`} />
                <Label 
                  htmlFor={`goal-${goal.id}`} 
                  className="cursor-pointer font-normal leading-tight"
                >
                  {goal.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showOtherInput && (
            <Input
              placeholder="Опишите вашу цель..."
              value={otherGoalText}
              onChange={(e) => setOtherGoalText(e.target.value)}
              className="mt-2"
            />
          )}
        </div>

        {/* Divider */}
        <Separator className="my-6" />

        {/* Block 2: Challenge Areas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">
                🔍 И 2-3 области для работы:
              </Label>
            </div>
            <span className="text-sm text-muted-foreground">
              Выбрано: {data.challenges.length}/{MAX_CHALLENGES}
            </span>
          </div>

          <div className="space-y-3">
            {challengeAreas.map((area) => {
              const isDisabled = isChallengeDisabled(area.id);
              const isChecked = data.challenges.includes(area.id);
              
              return (
                <div 
                  key={area.id} 
                  className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <Checkbox
                    id={`challenge-${area.id}`}
                    checked={isChecked}
                    onCheckedChange={() => handleChallengeToggle(area.id)}
                    disabled={isDisabled}
                  />
                  <Label
                    htmlFor={`challenge-${area.id}`}
                    className={`cursor-pointer font-normal leading-tight ${
                      isDisabled ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {area.label}
                  </Label>
                </div>
              );
            })}
          </div>

          {data.challenges.length >= MAX_CHALLENGES && (
            <p className="text-sm text-muted-foreground">
              Максимум {MAX_CHALLENGES} области. Снимите выбор, чтобы добавить другую.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3GoalsAndChallenges;
