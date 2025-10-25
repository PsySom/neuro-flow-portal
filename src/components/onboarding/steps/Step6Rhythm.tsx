import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step6RhythmProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const chronotypes = [
  { id: 'morning', label: '🌅 Жаворонок', description: 'Активен утром, рано ложусь' },
  { id: 'day', label: '☀️ Дневной', description: 'Пик активности днем' },
  { id: 'evening', label: '🌙 Сова', description: 'Активен вечером, поздно ложусь' },
  { id: 'varies', label: '🔄 Меняется', description: 'Зависит от обстоятельств' }
];

const commitments = [
  { id: '5-10', label: '5-10 минут в день' },
  { id: '15-20', label: '15-20 минут в день' },
  { id: '30-45', label: '30-45 минут в день' },
  { id: 'flexible', label: 'По желанию, без обязательств' }
];

const reminderOptions = [
  { id: 'morning', label: 'Утром' },
  { id: 'midday', label: 'Днем' },
  { id: 'evening', label: 'Вечером' },
  { id: 'none', label: 'Не нужны напоминания' }
];

const Step6Rhythm: React.FC<Step6RhythmProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Ваш ритм</h2>
        <p className="text-muted-foreground">
          Когда вам удобнее заниматься?
        </p>
      </div>

      <div className="space-y-6">
        {/* Chronotype */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Ваш хронотип</Label>
          <RadioGroup
            value={data.chronotype}
            onValueChange={(value) => updateData({ chronotype: value })}
          >
            {chronotypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="cursor-pointer font-normal">
                  <div className="flex flex-col">
                    <span>{type.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {type.description}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Time Commitment */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Сколько времени готовы уделять?
          </Label>
          <RadioGroup
            value={data.timeCommitment}
            onValueChange={(value) => updateData({ timeCommitment: value })}
          >
            {commitments.map((commitment) => (
              <div key={commitment.id} className="flex items-center space-x-2">
                <RadioGroupItem value={commitment.id} id={commitment.id} />
                <Label
                  htmlFor={commitment.id}
                  className="cursor-pointer font-normal"
                >
                  {commitment.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Reminders */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Когда напоминать о практиках?
          </Label>
          <RadioGroup
            value={data.reminders}
            onValueChange={(value) => updateData({ reminders: value })}
          >
            {reminderOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className="cursor-pointer font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default Step6Rhythm;
