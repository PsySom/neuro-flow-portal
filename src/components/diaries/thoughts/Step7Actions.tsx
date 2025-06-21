
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';
import { alternativeActions, copingStrategies } from './constants';

interface Step7ActionsProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step7Actions: React.FC<Step7ActionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Альтернативные реакции и сценарии</h3>
      <div className="space-y-4">
        <div>
          <Label>Что вы могли бы сделать иначе, если бы смотрели на ситуацию с поддержкой к себе?</Label>
          <div className="space-y-2 mt-2">
            {alternativeActions.map((action) => (
              <label key={action.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('alternativeActions').includes(action.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('alternativeActions');
                    if (checked) {
                      form.setValue('alternativeActions', [...current, action.value]);
                    } else {
                      form.setValue('alternativeActions', current.filter(a => a !== action.value));
                    }
                  }}
                />
                <span>{action.label}</span>
              </label>
            ))}
          </div>
          {form.watch('alternativeActions').includes('other') && (
            <Input
              placeholder="Опишите другое действие..."
              {...form.register('actionOther')}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label>Какие копинг-стратегии или упражнения могут поддержать вас в этот момент?</Label>
          <div className="space-y-2 mt-2">
            {copingStrategies.map((strategy) => (
              <label key={strategy.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('copingStrategies').includes(strategy.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('copingStrategies');
                    if (checked) {
                      form.setValue('copingStrategies', [...current, strategy.value]);
                    } else {
                      form.setValue('copingStrategies', current.filter(s => s !== strategy.value));
                    }
                  }}
                />
                <span>{strategy.label}</span>
              </label>
            ))}
          </div>
          {form.watch('copingStrategies').includes('other') && (
            <Input
              placeholder="Опишите другую стратегию..."
              {...form.register('copingOther')}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step7Actions;
