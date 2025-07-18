import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { SleepDiaryData, sleepDisruptorOptions } from './types';
import { AlertCircle } from 'lucide-react';

interface Step3FactorsProps {
  form: UseFormReturn<SleepDiaryData>;
  showFactors: boolean;
}

const Step3Factors: React.FC<Step3FactorsProps> = ({ form, showFactors }) => {
  const sleepDisruptors = form.watch('sleepDisruptors') || [];

  if (!showFactors) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😴</div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Отличный сон!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Ваш сон был качественным. Переходим к следующему шагу.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <AlertCircle className="w-12 h-12 mx-auto text-orange-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Факторы, влияющие на сон
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Что могло повлиять на качество или продолжительность вашего сна?
        </p>
      </div>

      <FormField
        control={form.control}
        name="sleepDisruptors"
        render={() => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
              Выберите до 3-х факторов:
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sleepDisruptorOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={sleepDisruptors.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (sleepDisruptors.length < 3) {
                            form.setValue('sleepDisruptors', [...sleepDisruptors, option]);
                          }
                        } else {
                          form.setValue('sleepDisruptors', sleepDisruptors.filter(item => item !== option));
                        }
                      }}
                      disabled={!sleepDisruptors.includes(option) && sleepDisruptors.length >= 3}
                    />
                    <label
                      htmlFor={option}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Выбрано: {sleepDisruptors.length} из 3
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sleepComment"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300">
              Дополнительные комментарии о сне (необязательно)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Расскажите подробнее о том, что влияло на ваш сон..."
                {...field}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Step3Factors;