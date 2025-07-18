import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SleepDiaryData, sleepQualityLabels } from './types';
import { Moon, Zap } from 'lucide-react';

interface Step2QualityProps {
  form: UseFormReturn<SleepDiaryData>;
}

const Step2Quality: React.FC<Step2QualityProps> = ({ form }) => {
  const sleepQuality = form.watch('sleepQuality');
  const nightAwakenings = form.watch('nightAwakenings');

  const awakeningOptions = [
    { value: 0, label: '0 раз', emoji: '😴' },
    { value: 1, label: '1 раз', emoji: '😐' },
    { value: 2, label: '2 раза', emoji: '😕' },
    { value: 3, label: '3+ раза', emoji: '😔' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Moon className="w-12 h-12 mx-auto text-primary mb-3" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Качество сна
        </h2>
        <p className="text-muted-foreground">
          Оцените, как прошла ваша ночь
        </p>
      </div>

      <FormField
        control={form.control}
        name="sleepQuality"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground text-lg mb-4 block">
              Как вы оцениваете качество вашего сна этой ночью?
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Slider
                  min={-5}
                  max={5}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {sleepQualityLabels[field.value.toString() as keyof typeof sleepQualityLabels]}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    От -5 (очень плохо) до +5 (отлично)
                  </div>
                </div>
                {field.value <= -2 && (
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                    <p className="text-warning text-sm">
                      💭 Низкое качество сна может потребовать внимания. Мы обсудим возможные причины на следующем шаге.
                    </p>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nightAwakenings"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground text-lg mb-4 block">
              Сколько раз вы просыпались ночью?
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {awakeningOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={field.value === option.value ? "default" : "outline"}
                    className="h-16 flex flex-col space-y-1"
                    onClick={() => field.onChange(option.value)}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
            </FormControl>
            <div className="text-sm text-muted-foreground mt-2">
              {field.value <= 1 && (
                <span className="text-success">
                  ✅ В пределах нормы
                </span>
              )}
              {field.value >= 2 && (
                <span className="text-warning">
                  ⚠️ Частые пробуждения могут влиять на качество сна
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step2Quality;