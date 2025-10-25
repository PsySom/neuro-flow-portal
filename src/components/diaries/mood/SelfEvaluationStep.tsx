
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { bodyStates } from './constants';
import { MoodStepProps } from './types';

const SelfEvaluationStep = ({ form }: MoodStepProps) => {
  const selectedBodyState = form.watch('bodyStateInfluence');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">Самооценка</h3>
      
      {/* Вопрос 13: Телесные ощущения */}
      <div className="space-y-4">
        <Label>Как сейчас твоё тело?</Label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {bodyStates.map((state) => (
            <button
              key={state.value}
              type="button"
              onClick={() => {
                form.setValue('bodyStateInfluence', state.value);
                if (state.value !== 'custom') {
                  form.setValue('bodyStateCustom', '');
                }
              }}
              className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                selectedBodyState === state.value
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{state.emoji}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{state.label}</div>
            </button>
          ))}
        </div>

        {selectedBodyState === 'custom' && (
          <Input
            placeholder="Опиши своё состояние..."
            {...form.register('bodyStateCustom')}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default SelfEvaluationStep;
