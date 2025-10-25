import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step3GoalsAndChallengesProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const goals = [
  { id: 'stress', label: 'Снизить уровень стресса' },
  { id: 'anxiety', label: 'Справиться с тревожностью' },
  { id: 'mood', label: 'Улучшить настроение' },
  { id: 'energy', label: 'Повысить энергию' },
  { id: 'sleep', label: 'Наладить сон' },
  { id: 'focus', label: 'Улучшить концентрацию' }
];

const challenges = [
  { id: 'procrastination', label: 'Прокрастинация' },
  { id: 'fatigue', label: 'Постоянная усталость' },
  { id: 'worry', label: 'Постоянные переживания' },
  { id: 'motivation', label: 'Отсутствие мотивации' },
  { id: 'burnout', label: 'Эмоциональное выгорание' },
  { id: 'sleep-issues', label: 'Проблемы со сном' }
];

const Step3GoalsAndChallenges: React.FC<Step3GoalsAndChallengesProps> = ({
  data,
  updateData
}) => {
  const handleChallengeToggle = (challengeId: string) => {
    const newChallenges = data.challenges.includes(challengeId)
      ? data.challenges.filter(c => c !== challengeId)
      : [...data.challenges, challengeId];
    updateData({ challenges: newChallenges });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Ваши цели и вызовы</h2>
        <p className="text-muted-foreground">
          Что для вас важнее всего?
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Главная цель (выберите одну)
          </Label>
          <RadioGroup
            value={data.primaryGoal}
            onValueChange={(value) => updateData({ primaryGoal: value })}
          >
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center space-x-2">
                <RadioGroupItem value={goal.id} id={goal.id} />
                <Label htmlFor={goal.id} className="cursor-pointer font-normal">
                  {goal.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Challenges */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            С чем вы сталкиваетесь? (можно выбрать несколько)
          </Label>
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge.id}
                  checked={data.challenges.includes(challenge.id)}
                  onCheckedChange={() => handleChallengeToggle(challenge.id)}
                />
                <Label
                  htmlFor={challenge.id}
                  className="cursor-pointer font-normal"
                >
                  {challenge.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3GoalsAndChallenges;
