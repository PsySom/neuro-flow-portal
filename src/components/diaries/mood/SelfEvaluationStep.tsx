
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { bodyStates } from './constants';
import { MoodStepProps } from './types';

const SelfEvaluationStep = ({ form }: MoodStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Как это влияло на твое состояние тела?</h3>
      
      <div className="space-y-4">
        {/* Вопрос о влиянии на состояние тела */}
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">Выбери подходящее состояние:</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {bodyStates.map((state) => (
              <button
                key={state.value}
                type="button"
                onClick={() => form.setValue('bodyStateInfluence', state.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                  form.watch('bodyStateInfluence') === state.value
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/30'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-2xl mb-1">{state.emoji}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{state.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Поле для своего ответа */}
        <div className="space-y-2">
          <Label>Свой ответ:</Label>
          <Input
            placeholder="Опиши свое состояние тела своими словами..."
            {...form.register('bodyStateCustom')}
          />
        </div>

        <div>
          <Label>Если оглянуться на прошедший день, насколько тебе удалось справляться с эмоциями?</Label>
          <div className="mt-2">
            <Slider
              value={[form.watch('selfEvaluation') || 0]}
              onValueChange={(value) => form.setValue('selfEvaluation', value[0])}
              min={-5}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Совсем не справлялся -5</span>
              <span>Отлично справлялся +5</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Что тебе помогло или кого ты хочешь поблагодарить?</Label>
          <Input
            placeholder="Благодарность и поддержка..."
            {...form.register('gratitude')}
          />
        </div>
      </div>
    </div>
  );
};

export default SelfEvaluationStep;
