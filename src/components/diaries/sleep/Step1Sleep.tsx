import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SleepDiaryData } from './types';
import { Clock } from 'lucide-react';

interface Step1SleepProps {
  form: UseFormReturn<SleepDiaryData>;
}

const Step1Sleep: React.FC<Step1SleepProps> = ({ form }) => {
  const bedtime = form.watch('bedtime');
  const wakeUpTime = form.watch('wakeUpTime');

  // Автоматический расчет продолжительности сна
  React.useEffect(() => {
    if (bedtime && wakeUpTime) {
      const bedDate = new Date(`2024-01-01 ${bedtime}`);
      let wakeDate = new Date(`2024-01-01 ${wakeUpTime}`);
      
      // Если время пробуждения раньше времени отхода ко сну, добавляем день
      if (wakeDate < bedDate) {
        wakeDate = new Date(`2024-01-02 ${wakeUpTime}`);
      }
      
      const diffMs = wakeDate.getTime() - bedDate.getTime();
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      
      form.setValue('sleepDuration', diffHours);
    }
  }, [bedtime, wakeUpTime, form]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Clock className="w-12 h-12 mx-auto text-blue-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Время сна и пробуждения
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Расскажите о своем режиме сна прошлой ночью
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="bedtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">
                Время отхода ко сну
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wakeUpTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">
                Время пробуждения
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="sleepDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300">
              Продолжительность сна (часы)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
              />
            </FormControl>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {field.value < 6 && field.value > 0 && (
                <span className="text-orange-600 dark:text-orange-400">
                  ⚠️ Дефицит сна (норма: 7-9 часов)
                </span>
              )}
              {field.value >= 6 && field.value <= 9 && (
                <span className="text-green-600 dark:text-green-400">
                  ✅ В пределах нормы (7-9 часов)
                </span>
              )}
              {field.value > 10 && (
                <span className="text-blue-600 dark:text-blue-400">
                  ℹ️ Возможно связано с усталостью или другими факторами
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

export default Step1Sleep;