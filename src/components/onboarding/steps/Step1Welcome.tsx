import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step1WelcomeProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const Step1Welcome: React.FC<Step1WelcomeProps> = ({ onNext }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          Добро пожаловать в Mental Balance
        </h1>
        <p className="text-lg text-muted-foreground">
          Давайте узнаем друг друга лучше
        </p>
      </div>

      <div className="space-y-4 py-6">
        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Персональные рекомендации</p>
            <p className="text-sm text-muted-foreground">
              На основе ваших ответов мы подберем практики специально для вас
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Отслеживание прогресса</p>
            <p className="text-sm text-muted-foreground">
              Наблюдайте за изменениями вашего состояния день за днем
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">Научно обоснованные методы</p>
            <p className="text-sm text-muted-foreground">
              Все практики основаны на когнитивно-поведенческой терапии
            </p>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        onClick={onNext}
        className="w-full"
      >
        Начать
      </Button>
    </div>
  );
};

export default Step1Welcome;
