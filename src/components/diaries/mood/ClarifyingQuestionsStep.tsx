
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { emotionsData } from '../moodDiaryUtils';
import { lifeSpheres, bodyStates } from './constants';
import { MoodStepProps } from './types';

interface ClarifyingQuestionsStepProps extends MoodStepProps {
  selectedEmotions: Array<{name: string; intensity: number}>;
  showNegativeQuestions: boolean;
  showPositiveQuestions: boolean;
}

const ClarifyingQuestionsStep = ({ 
  form, 
  selectedEmotions, 
  showNegativeQuestions, 
  showPositiveQuestions 
}: ClarifyingQuestionsStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">Уточняющие вопросы</h3>
      
      {/* Основные вопросы - всегда показываем если есть выбранные эмоции */}
      {selectedEmotions.length > 0 && (
        <>
          {/* Вопрос: С чем связанно это чувство? */}
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

          {/* Вопрос: На что влияет эта эмоция? */}
          <div className="space-y-2">
            <Label>На что влияет эта эмоция? Чему мешает или помогает?</Label>
            <Textarea
              placeholder="Опиши, как эмоция влияет на твою жизнь, деятельность, отношения..."
              {...form.register('emotionImpact')}
              rows={3}
            />
          </div>

          {/* Вопрос о влиянии на состояние тела */}
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Как это влияло на твое состояние тела?</h4>
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

          {/* Вопрос о связанных мыслях */}
          <div className="space-y-2">
            <Label>Какие мысли с этим связаны?</Label>
            <Textarea
              placeholder="Опиши свои мысли и размышления..."
              {...form.register('relatedThoughts')}
              rows={3}
            />
          </div>

          {/* Перенесенный вопрос из шага 2 */}
          <div className="space-y-2">
            <Label>Если хочется, опиши, как это проявлялось или что этому способствовало:</Label>
            <Input
              placeholder="Дополнительные комментарии об эмоциях..."
              {...form.register('emotionComment')}
            />
          </div>
        </>
      )}
      
      {/* Углубленные вопросы для сильных негативных эмоций */}
      {showNegativeQuestions && (
        <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h4 className="font-medium text-orange-900 dark:text-orange-100">Работа с негативными эмоциями</h4>
          
          <div className="space-y-2">
            <Label>Что именно вызвало это чувство?</Label>
            <select 
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              {...form.register('triggerSource')}
            >
              <option value="">Выберите источник</option>
              <option value="external">Внешнее событие</option>
              <option value="thoughts">Внутренние мысли</option>
              <option value="communication">Общение</option>
              <option value="physical">Физиологические причины</option>
              <option value="self-esteem">Самооценка</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Какая мысль или фраза приходила тебе в голову в этот момент?</Label>
            <Input
              placeholder="Опиши свои мысли..."
              {...form.register('triggerThought')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cognitiveBias"
              {...form.register('hasCognitiveBias')}
            />
            <Label htmlFor="cognitiveBias">
              Были ли среди этих мыслей категоричные («я всегда», «я не могу», «у меня не получится»)?
            </Label>
          </div>

          {form.watch('hasCognitiveBias') && (
            <div className="space-y-2">
              <Label>Можешь переформулировать эту мысль так, чтобы она звучала мягче и поддерживающе для тебя?</Label>
              <Input
                placeholder="Переформулированная мысль..."
                {...form.register('reframedThought')}
              />
            </div>
          )}
        </div>
      )}

      {/* Вопросы для сильных позитивных эмоций */}
      {showPositiveQuestions && (
        <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100">Позитивные моменты</h4>
          
          <div className="space-y-2">
            <Label>Что способствовало этому прекрасному состоянию?</Label>
            <Input
              placeholder="Опиши событие, процесс, поддержку, достижение..."
              {...form.register('positiveSource')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClarifyingQuestionsStep;
