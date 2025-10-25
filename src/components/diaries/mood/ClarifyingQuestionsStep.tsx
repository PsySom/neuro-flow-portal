
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { lifeSpheres } from './constants';
import { MoodStepProps } from './types';

interface ClarifyingQuestionsStepProps extends MoodStepProps {
  selectedEmotions: Array<{name: string; intensity: number}>;
}

const ClarifyingQuestionsStep = ({ 
  form, 
  selectedEmotions
}: ClarifyingQuestionsStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">Уточняющие вопросы</h3>
      
      {/* Основные вопросы - всегда показываем если есть выбранные эмоции */}
      {selectedEmotions.length > 0 && (
        <>
          {/* Вопрос 4: С чем связанно это чувство? */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">С чем связанно это чувство?</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {lifeSpheres.map((sphere) => (
                <button
                  key={sphere.value}
                  type="button"
                  onClick={() => form.setValue('emotionConnection', sphere.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                    form.watch('emotionConnection') === sphere.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{sphere.emoji}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{sphere.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Вопрос 7: Если хочется, опиши, как это проявлялось или что этому способствовало */}
          <div className="space-y-2">
            <Label>Если хочется, опиши, как это проявлялось или что этому способствовало:</Label>
            <Textarea
              placeholder="Дополнительные комментарии об эмоциях..."
              {...form.register('emotionComment')}
              rows={4}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClarifyingQuestionsStep;
