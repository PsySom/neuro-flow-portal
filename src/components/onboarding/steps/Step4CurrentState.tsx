import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step4CurrentStateProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const energyLevels = [
  { id: 'very-low', label: 'Очень низкий', emoji: '😴' },
  { id: 'low', label: 'Низкий', emoji: '😑' },
  { id: 'medium', label: 'Средний', emoji: '😐' },
  { id: 'high', label: 'Высокий', emoji: '🙂' },
  { id: 'very-high', label: 'Очень высокий', emoji: '⚡' }
];

const getMoodEmoji = (value: number) => {
  if (value <= 2) return '😔';
  if (value <= 4) return '😕';
  if (value <= 6) return '😐';
  if (value <= 8) return '🙂';
  return '😊';
};

const Step4CurrentState: React.FC<Step4CurrentStateProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">💭 Как бы вы описали своё текущее состояние?</h2>
        <p className="text-muted-foreground">
          Оцените ваше самочувствие прямо сейчас
        </p>
      </div>

      <div className="space-y-8">
        {/* Mood Slider */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            Настроение:
          </Label>
          
          <div className="space-y-6 px-2">
            {/* Current mood display */}
            <div className="text-center">
              <span className="text-5xl">{getMoodEmoji(data.mood)}</span>
              <p className="text-sm text-muted-foreground mt-2">
                {data.mood}/10
              </p>
            </div>

            {/* Slider */}
            <div className="relative">
              <Slider
                value={[data.mood]}
                onValueChange={([value]) => updateData({ mood: value })}
                min={0}
                max={10}
                step={1}
                className="py-4"
              />
              
              {/* Emoji indicators */}
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😔</span>
                  <span className="text-xs text-muted-foreground mt-1">Плохое</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl">😊</span>
                  <span className="text-xs text-muted-foreground mt-1">Отличное</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Уровень энергии:
          </Label>
          
          <RadioGroup
            value={data.energy}
            onValueChange={(value) => updateData({ energy: value })}
            className="space-y-3"
          >
            {energyLevels.map((level) => (
              <div 
                key={level.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={level.id} id={level.id} className="mt-0" />
                <Label 
                  htmlFor={level.id} 
                  className="cursor-pointer font-normal text-base flex items-center gap-3 flex-1"
                >
                  <span className="text-xl">{level.emoji}</span>
                  <span>{level.label}</span>
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
