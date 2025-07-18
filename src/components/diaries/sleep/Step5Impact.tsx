import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { SleepDiaryData } from './types';
import { Brain, CheckCircle } from 'lucide-react';

interface Step5ImpactProps {
  form: UseFormReturn<SleepDiaryData>;
  onSubmit: (data: SleepDiaryData) => void;
  recommendations: string[];
}

const Step5Impact: React.FC<Step5ImpactProps> = ({ form, onSubmit, recommendations }) => {
  const overallSleepImpact = form.watch('overallSleepImpact');

  const handleSubmit = () => {
    const formData = form.getValues();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Brain className="w-12 h-12 mx-auto text-green-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Влияние сна на день
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Подведём итоги и получим рекомендации
        </p>
      </div>

      <FormField
        control={form.control}
        name="overallSleepImpact"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-lg mb-4 block">
              Как общее качество сна и отдыха повлияло на ваше настроение и способность справляться с делами сегодня?
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Slider
                  min={-5}
                  max={5}
                  step={1}
                  value={[field.value || 0]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
                <div className="text-center">
                  <div className="text-xl mb-2">
                    {field.value <= -3 && '😔 Очень негативно'}
                    {field.value > -3 && field.value <= -1 && '😕 Негативно'}
                    {field.value > -1 && field.value <= 1 && '😐 Незаметно'}
                    {field.value > 1 && field.value <= 3 && '😊 Позитивно'}
                    {field.value > 3 && '✨ Очень позитивно'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Влияние: {field.value}/5
                  </div>
                </div>
                {field.value <= -2 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      💙 Плохое качество сна серьёзно влияет на ваш день. Важно обратить внимание на улучшение сна.
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
        name="restComment"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300">
              Дополнительные наблюдения (необязательно)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Поделитесь своими мыслями о сне и отдыхе..."
                {...field}
                className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {recommendations.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💚 Персональные рекомендации
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-green-700 dark:text-green-300 text-sm flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          💤 Спасибо, что внимательно отнеслись к своему сну и отдыху. Помните, что даже небольшие улучшения в рутине могут значительно поддержать ваше состояние.
        </p>
        
        <Button
          onClick={handleSubmit}
          className="w-full max-w-md bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
        >
          Завершить дневник
        </Button>
      </div>
    </div>
  );
};

export default Step5Impact;