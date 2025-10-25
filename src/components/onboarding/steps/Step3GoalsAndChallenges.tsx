import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '../hooks/useOnboardingState';
import { cn } from '@/lib/utils';

interface Step3GoalsAndChallengesProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
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
  { id: 'anxiety', label: 'Тревога и беспокойство', icon: '😰', description: 'Постоянное беспокойство и напряжение' },
  { id: 'stress', label: 'Стресс и напряжение', icon: '😓', description: 'Трудно расслабиться и отдохнуть' },
  { id: 'procrastination', label: 'Прокрастинация', icon: '⏰', description: 'Откладываю дела на потом' },
  { id: 'self-esteem', label: 'Низкая самооценка', icon: '😔', description: 'Недостаток уверенности в себе' },
  { id: 'sleep-issues', label: 'Проблемы со сном', icon: '😴', description: 'Плохо засыпаю или часто просыпаюсь' },
  { id: 'low-energy', label: 'Недостаток энергии', icon: '🔋', description: 'Постоянная усталость' },
  { id: 'concentration', label: 'Трудности с концентрацией', icon: '🎯', description: 'Сложно сосредоточиться на задачах' },
  { id: 'mood-swings', label: 'Перепады настроения', icon: '🎭', description: 'Резкие изменения эмоционального состояния' },
  { id: 'loneliness', label: 'Одиночество', icon: '😞', description: 'Ощущение изоляции и отсутствия поддержки' },
  { id: 'burnout', label: 'Выгорание', icon: '🔥', description: 'Эмоциональное и физическое истощение' },
  { id: 'relationship-issues', label: 'Проблемы в отношениях', icon: '💔', description: 'Конфликты и непонимание' },
  { id: 'other', label: 'Иное', icon: '✏️', description: 'Другие трудности' }
];

const MAX_CHALLENGES = 3;

const Step3GoalsAndChallenges: React.FC<Step3GoalsAndChallengesProps> = ({
  data,
  updateData,
  onNext,
  onPrev
}) => {
  const [otherText, setOtherText] = useState('');

  const handleChallengeToggle = (challengeId: string) => {
    const currentChallenges = data.challenges || [];
    const newChallenges = currentChallenges.includes(challengeId)
      ? currentChallenges.filter(c => c !== challengeId)
      : [...currentChallenges, challengeId];
    
    // Limit to MAX_CHALLENGES
    if (newChallenges.length <= MAX_CHALLENGES) {
      updateData({ challenges: newChallenges });
    }
  };

  const isChallengeDisabled = (challengeId: string) => {
    const currentChallenges = data.challenges || [];
    return !currentChallenges.includes(challengeId) && currentChallenges.length >= MAX_CHALLENGES;
  };

  const handleSkip = () => {
    // Allow skip with empty challenges
    updateData({ challenges: [] });
    onNext();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">С какими трудностями вы сталкиваетесь?</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Выберите до {MAX_CHALLENGES} основных проблем
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challengeAreas.map((challenge) => {
            const isSelected = (data.challenges || []).includes(challenge.id);
            const isDisabled = isChallengeDisabled(challenge.id);

            return (
              <button
                key={challenge.id}
                type="button"
                onClick={() => !isDisabled && handleChallengeToggle(challenge.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-xl border-2 transition-all text-left",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-accent/50",
                  isDisabled && "opacity-50 cursor-not-allowed hover:scale-100"
                )}
              >
                <span className="text-3xl flex-shrink-0">{challenge.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-1">{challenge.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {challenge.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Other input */}
        {(data.challenges || []).includes('other') && (
          <div className="space-y-2">
            <Input
              placeholder="Опишите вашу трудность..."
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="w-full"
              aria-label="Опишите вашу трудность"
            />
          </div>
        )}

        {/* Selection counter */}
        {(data.challenges || []).length > 0 && (
          <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm font-medium">
              Выбрано: {(data.challenges || []).length} из {MAX_CHALLENGES}
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
          >
            Назад
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Пропустить
          </Button>
          
          <Button
            onClick={onNext}
            disabled={(data.challenges || []).length < 1 || (data.challenges || []).length > MAX_CHALLENGES}
            className="flex-1 max-w-xs"
          >
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3GoalsAndChallenges;
