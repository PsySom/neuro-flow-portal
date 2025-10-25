import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Target, Clock } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step7CompleteProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onComplete: () => void;
}

const Step7Complete: React.FC<Step7CompleteProps> = ({ data, onComplete }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          Отлично, {data.name}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Мы готовы начать ваше путешествие к балансу
        </p>
      </div>

      <div className="space-y-4 py-6">
        <div className="p-4 bg-muted/50 rounded-lg text-left">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Ваша главная цель</p>
              <p className="text-sm text-muted-foreground">
                {data.primaryGoal ? goals[data.primaryGoal as keyof typeof goals] : 'Не указана'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-left">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Время для практик</p>
              <p className="text-sm text-muted-foreground">
                {data.timeCommitment ? commitments[data.timeCommitment as keyof typeof commitments] : 'Не указано'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-left">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Персональный план готов</p>
              <p className="text-sm text-muted-foreground">
                Мы подобрали практики специально для вас
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={onComplete}
        className="w-full"
      >
        Начать путешествие
      </Button>
    </div>
  );
};

// Helper mappings
const goals: Record<string, string> = {
  'stress': 'Снизить уровень стресса',
  'anxiety': 'Справиться с тревожностью',
  'mood': 'Улучшить настроение',
  'energy': 'Повысить энергию',
  'sleep': 'Наладить сон',
  'focus': 'Улучшить концентрацию'
};

const commitments: Record<string, string> = {
  '5-10': '5-10 минут в день',
  '15-20': '15-20 минут в день',
  '30-45': '30-45 минут в день',
  'flexible': 'По желанию'
};

export default Step7Complete;
