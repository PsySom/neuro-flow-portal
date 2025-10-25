import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { OnboardingData } from '../hooks/useOnboardingState';

interface Step5SleepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const Step5Sleep: React.FC<Step5SleepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Ваш сон</h2>
        <p className="text-muted-foreground">
          Расскажите о вашем режиме сна
        </p>
      </div>

      <div className="space-y-6">
        {/* Sleep Quality */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-base font-semibold">Качество сна</Label>
            <span className="text-sm text-muted-foreground">
              {data.sleepQuality}/10
            </span>
          </div>
          <Slider
            value={[data.sleepQuality]}
            onValueChange={([value]) => updateData({ sleepQuality: value })}
            min={1}
            max={10}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Очень плохое</span>
            <span>Отличное</span>
          </div>
        </div>

        {/* Bed Time */}
        <div className="space-y-2">
          <Label htmlFor="bedTime" className="text-base font-semibold">
            Во сколько вы обычно ложитесь спать?
          </Label>
          <Input
            id="bedTime"
            type="time"
            value={data.bedTime}
            onChange={(e) => updateData({ bedTime: e.target.value })}
          />
        </div>

        {/* Wake Time */}
        <div className="space-y-2">
          <Label htmlFor="wakeTime" className="text-base font-semibold">
            Во сколько вы обычно просыпаетесь?
          </Label>
          <Input
            id="wakeTime"
            type="time"
            value={data.wakeTime}
            onChange={(e) => updateData({ wakeTime: e.target.value })}
          />
        </div>

        {/* Sleep Duration */}
        <div className="space-y-2">
          <Label htmlFor="sleepDuration" className="text-base font-semibold">
            Сколько часов вы обычно спите?
          </Label>
          <Input
            id="sleepDuration"
            placeholder="Например: 7-8 часов"
            value={data.sleepDuration}
            onChange={(e) => updateData({ sleepDuration: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default Step5Sleep;
