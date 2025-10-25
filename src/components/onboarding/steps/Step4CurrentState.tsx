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
  { id: 'very-low', label: 'Очень низкий', emoji: '😴' },
  { id: 'low', label: 'Низкий', emoji: '😑' },
  { id: 'medium', label: 'Средний', emoji: '😐' },
  { id: 'high', label: 'Высокий', emoji: '🙂' },
  { id: 'very-high', label: 'Очень высокий', emoji: '⚡' }
];

const anxietyLevels = [
  { id: 'very-low', label: 'Очень низкая', emoji: '😌' },
  { id: 'low', label: 'Низкая', emoji: '🙂' },
  { id: 'medium', label: 'Средняя', emoji: '😐' },
  { id: 'high', label: 'Высокая', emoji: '😰' },
  { id: 'very-high', label: 'Очень высокая', emoji: '😱' }
];

const stressLevels = [
  { id: 'very-low', label: 'Очень низкий', emoji: '😊' },
  { id: 'low', label: 'Низкий', emoji: '🙂' },
  { id: 'medium', label: 'Средний', emoji: '😐' },
  { id: 'high', label: 'Высокий', emoji: '😫' },
  { id: 'very-high', label: 'Очень высокий', emoji: '🤯' }
];

const getMoodEmoji = (value: number) => {
  if (value <= 2) return '😔';
  if (value <= 4) return '😕';
  if (value <= 6) return '😐';
  if (value <= 8) return '🙂';
  return '😊';
};

const getMoodLabel = (value: number) => {
  if (value <= 2) return 'Плохое';
  if (value <= 4) return 'Ниже среднего';
  if (value <= 6) return 'Среднее';
  if (value <= 8) return 'Хорошее';
  return 'Отличное';
};

const Step4CurrentState: React.FC<Step4CurrentStateProps> = ({
  data,
  updateData
}) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Ваше текущее состояние</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Расскажите, как вы себя чувствуете сейчас
        </p>
      </div>

      <div className="space-y-6">
        {/* Mood Slider */}
        <div className="space-y-5">
          <div className="text-center">
            <Label className="text-lg font-bold">Настроение сегодня</Label>
          </div>
          
          <div className="text-center space-y-3">
            {/* Large mood emoji without background */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 rounded-full flex items-center justify-center">
                <span className="text-6xl">{getMoodEmoji(data.mood)}</span>
              </div>
            </div>
            
            {/* Mood score */}
            <div>
              <p className="text-2xl font-bold text-primary">
                {data.mood}/10
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {getMoodLabel(data.mood)}
              </p>
            </div>
          </div>

          {/* Slider with 5 emojis */}
          <div className="px-2">
            <Slider
              value={[data.mood]}
              onValueChange={([value]) => updateData({ mood: value })}
              min={0}
              max={10}
              step={1}
              className="py-4"
              aria-label={`Настроение: ${data.mood} из 10`}
            />
            
            {/* 5 Emoji scale */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">😔</span>
                <span className="text-xs text-muted-foreground font-medium">Плохое</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">😕</span>
                <span className="text-xs text-muted-foreground font-medium">Ниже</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">😐</span>
                <span className="text-xs text-muted-foreground font-medium">Средне</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">🙂</span>
                <span className="text-xs text-muted-foreground font-medium">Хорошее</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">😊</span>
                <span className="text-xs text-muted-foreground font-medium">Отличное</span>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-lg font-bold">Уровень энергии</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Насколько вы бодры прямо сейчас?
            </p>
          </div>
          
          <RadioGroup
            value={data.energy}
            onValueChange={(value) => updateData({ energy: value })}
            className="grid grid-cols-1 gap-2"
          >
            {energyLevels.map((level) => (
              <div 
                key={level.id} 
                className={`
                  flex items-center space-x-3 p-3 rounded-xl border-2 
                  transition-all cursor-pointer hover:scale-[1.01]
                  ${data.energy === level.id 
                    ? 'border-primary bg-primary/10 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <RadioGroupItem value={level.id} id={level.id} className="mt-0" />
                <Label 
                  htmlFor={level.id} 
                  className="cursor-pointer font-normal flex items-center gap-2 flex-1"
                >
                  <span className="text-xl">{level.emoji}</span>
                  <span>{level.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Anxiety Level */}
        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-lg font-bold">Уровень тревоги</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Насколько вы тревожны сейчас?
            </p>
          </div>
          
          <RadioGroup
            value={data.anxiety}
            onValueChange={(value) => updateData({ anxiety: value })}
            className="grid grid-cols-1 gap-2"
          >
            {anxietyLevels.map((level) => (
              <div 
                key={level.id} 
                className={`
                  flex items-center space-x-3 p-3 rounded-xl border-2 
                  transition-all cursor-pointer hover:scale-[1.01]
                  ${data.anxiety === level.id 
                    ? 'border-primary bg-primary/10 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <RadioGroupItem value={level.id} id={`anxiety-${level.id}`} className="mt-0" />
                <Label 
                  htmlFor={`anxiety-${level.id}`}
                  className="cursor-pointer font-normal flex items-center gap-2 flex-1"
                >
                  <span className="text-xl">{level.emoji}</span>
                  <span>{level.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Stress Level */}
        <div className="space-y-4">
          <div className="text-center">
            <Label className="text-lg font-bold">Уровень стресса</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Насколько вы напряжены сейчас?
            </p>
          </div>
          
          <RadioGroup
            value={data.stress}
            onValueChange={(value) => updateData({ stress: value })}
            className="grid grid-cols-1 gap-2"
          >
            {stressLevels.map((level) => (
              <div 
                key={level.id} 
                className={`
                  flex items-center space-x-3 p-3 rounded-xl border-2 
                  transition-all cursor-pointer hover:scale-[1.01]
                  ${data.stress === level.id 
                    ? 'border-primary bg-primary/10 shadow-sm' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <RadioGroupItem value={level.id} id={`stress-${level.id}`} className="mt-0" />
                <Label 
                  htmlFor={`stress-${level.id}`}
                  className="cursor-pointer font-normal flex items-center gap-2 flex-1"
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
