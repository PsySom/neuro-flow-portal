
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';
import { triggers } from './constants';

interface Step2DescriptionProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step2Description: React.FC<Step2DescriptionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Фиксация и описание</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Запишите дословно тревожащую или мешающую мысль/убеждение
          </Label>
          <Textarea
            placeholder="Что меня сегодня больше всего задело?"
            {...form.register('thoughtText')}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Когда эта мысль появилась — что её спровоцировало?</Label>
          <div className="space-y-2">
            {triggers.map((trigger) => (
              <label key={trigger.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={trigger.value}
                  checked={form.watch('trigger') === trigger.value}
                  onChange={() => form.setValue('trigger', trigger.value)}
                  className="w-4 h-4"
                />
                <span>{trigger.label}</span>
              </label>
            ))}
          </div>
          {form.watch('trigger') === 'other' && (
            <Input
              placeholder="Опишите подробнее..."
              {...form.register('triggerOther')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Description;
