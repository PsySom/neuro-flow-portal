import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step4CurrentStateProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const energyLevels = [
  { id: 'very-low', label: 'Очень низкая' },
  { id: 'low', label: 'Низкая' },
  { id: 'medium', label: 'Средняя' },
  { id: 'high', label: 'Высокая' },
  { id: 'very-high', label: 'Очень высокая' }
];

const Step4CurrentState: React.FC<Step4CurrentStateProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Как вы себя чувствуете?</h2>
        <p className="text-muted-foreground">
          Оцените ваше текущее состояние
        </p>
      </div>

      <div className="space-y-6">
        {/* Mood */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Настроение</Label>
            <span className="text-sm text-muted-foreground">
              {data.mood}/10
            </span>
          </div>
          <Slider
            value={[data.mood]}
            onValueChange={([value]) => updateData({ mood: value })}
            min={1}
            max={10}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Плохое</span>
            <span>Отличное</span>
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Уровень энергии</Label>
          <RadioGroup
            value={data.energy}
            onValueChange={(value) => updateData({ energy: value })}
          >
            {energyLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <RadioGroupItem value={level.id} id={level.id} />
                <Label htmlFor={level.id} className="cursor-pointer font-normal">
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default Step4CurrentState;
