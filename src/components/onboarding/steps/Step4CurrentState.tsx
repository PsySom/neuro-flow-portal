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
        <h2 className="text-2xl font-bold">Какое у вас настроение сейчас?</h2>
        <p className="text-muted-foreground">
          Это поможет нам понять ваше текущее состояние
        </p>
      </div>

      <div className="space-y-10">
        {/* Mood Slider - Improved UX */}
        <div className="space-y-6">
          <div className="text-center space-y-4">
            {/* Large mood emoji */}
            <div className="inline-block p-6 rounded-full bg-primary/10">
              <span className="text-7xl">{getMoodEmoji(data.mood)}</span>
            </div>
            
            {/* Mood score */}
            <div>
              <p className="text-3xl font-bold text-primary">
                {data.mood}/10
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.mood <= 3 && 'Тяжёлый день'}
                {data.mood > 3 && data.mood <= 5 && 'Могло быть лучше'}
                {data.mood > 5 && data.mood <= 7 && 'В целом нормально'}
                {data.mood > 7 && data.mood <= 9 && 'Хороший день'}
                {data.mood > 9 && 'Отличное настроение!'}
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="px-4">
            <Slider
              value={[data.mood]}
              onValueChange={([value]) => updateData({ mood: value })}
              min={0}
              max={10}
              step={1}
              className="py-6"
              aria-label={`Настроение: ${data.mood} из 10`}
            />
            
            {/* Emoji scale */}
            <div className="flex justify-between items-center mt-3 px-2">
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">😔</span>
                <span className="text-xs text-muted-foreground font-medium">Плохое</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">😐</span>
                <span className="text-xs text-muted-foreground font-medium">Норма</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">😊</span>
                <span className="text-xs text-muted-foreground font-medium">Отличное</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Level - Improved UI */}
        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-lg font-semibold flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Уровень энергии
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Насколько вы бодры прямо сейчас?
            </p>
          </div>
          
          <RadioGroup
            value={data.energy}
            onValueChange={(value) => updateData({ energy: value })}
            className="grid grid-cols-1 gap-3"
          >
            {energyLevels.map((level) => (
              <div 
                key={level.id} 
                className={`
                  flex items-center space-x-4 p-4 rounded-xl border-2 
                  transition-all cursor-pointer
                  ${data.energy === level.id 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                <RadioGroupItem value={level.id} id={level.id} className="mt-0" />
                <Label 
                  htmlFor={level.id} 
                  className="cursor-pointer font-normal text-base flex items-center gap-3 flex-1"
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <span className="font-medium">{level.label}</span>
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
