import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { UseFormReturn } from 'react-hook-form';
import { SleepDiaryData, dayRestTypes } from './types';
import { Sun, Coffee } from 'lucide-react';

interface Step4RestProps {
  form: UseFormReturn<SleepDiaryData>;
}

const Step4Rest: React.FC<Step4RestProps> = ({ form }) => {
  const morningFeeling = form.watch('morningFeeling');
  const hasDayRest = form.watch('hasDayRest');
  const dayRestEffectiveness = form.watch('dayRestEffectiveness');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Sun className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Утреннее самочувствие и отдых
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Как вы чувствовали себя после пробуждения и отдыхали ли днём?
        </p>
      </div>

      <FormField
        control={form.control}
        name="morningFeeling"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-lg mb-4 block">
              Как вы чувствовали себя утром после пробуждения?
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value || 5]}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="w-full"
                />
                <div className="text-center">
                  <div className="text-xl mb-2">
                    {field.value <= 3 && '😴 Разбит(а), тяжело вставать'}
                    {field.value > 3 && field.value <= 5 && '😐 Средне'}
                    {field.value > 5 && field.value <= 7 && '😊 Неплохо'}
                    {field.value > 7 && field.value <= 9 && '😃 Хорошо'}
                    {field.value > 9 && '✨ Легко, в ресурсе'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Оценка: {field.value}/10
                  </div>
                </div>
                {field.value <= 5 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      💙 Пониженная ресурсность может быть связана с качеством сна. Важно обратить внимание на восстановление.
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
        name="hasDayRest"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-300 text-lg">
              Был ли у вас сегодня дневной отдых, пауза или короткий сон?
            </FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ? 'yes' : 'no'}
                onValueChange={(value) => field.onChange(value === 'yes')}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <label htmlFor="yes" className="text-gray-700 dark:text-gray-300">Да</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <label htmlFor="no" className="text-gray-700 dark:text-gray-300">Нет</label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {hasDayRest && (
        <>
          <FormField
            control={form.control}
            name="dayRestType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Что это было?
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Выберите тип отдыха" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayRestTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dayRestEffectiveness"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300 text-lg mb-4 block">
                  Насколько этот отдых помог вам восстановиться?
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value || 5]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="text-center">
                      <div className="text-xl mb-2">
                        <Coffee className="w-6 h-6 inline mr-2" />
                        Эффективность: {field.value}/10
                      </div>
                    </div>
                    {field.value < 5 && (
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                        <p className="text-orange-700 dark:text-orange-300 text-sm">
                          💡 Возможно, стоит попробовать другие способы восстановления или изменить подход к отдыху.
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default Step4Rest;