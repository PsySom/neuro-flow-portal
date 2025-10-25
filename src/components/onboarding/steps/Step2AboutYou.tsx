import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step2AboutYouProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const Step2AboutYou: React.FC<Step2AboutYouProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Расскажите о себе</h2>
        <p className="text-muted-foreground">
          Это поможет нам персонализировать ваш опыт
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Как вас зовут?</Label>
          <Input
            id="name"
            placeholder="Введите ваше имя"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Сколько вам лет?</Label>
          <Input
            id="age"
            type="number"
            placeholder="Введите ваш возраст"
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            min="13"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Часовой пояс</Label>
          <Input
            id="timezone"
            value={data.timezone}
            onChange={(e) => updateData({ timezone: e.target.value })}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Определяется автоматически
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2AboutYou;
