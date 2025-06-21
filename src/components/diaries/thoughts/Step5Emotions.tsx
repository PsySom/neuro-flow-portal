
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ThoughtsDiaryData } from './types';
import { emotions, reactions } from './constants';

interface Step5EmotionsProps {
  form: UseFormReturn<ThoughtsDiaryData>;
}

const Step5Emotions: React.FC<Step5EmotionsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Эмоции и реакция</h3>
      <div className="space-y-4">
        <div>
          <Label>Какие чувства вызывает эта мысль? (можно выбрать несколько)</Label>
          <div className="space-y-2 mt-2">
            {emotions.map((emotion) => (
              <label key={emotion.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('emotions').includes(emotion.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('emotions');
                    if (checked) {
                      form.setValue('emotions', [...current, emotion.value]);
                    } else {
                      form.setValue('emotions', current.filter(e => e !== emotion.value));
                    }
                  }}
                />
                <span>{emotion.label}</span>
              </label>
            ))}
          </div>
          {form.watch('emotions').includes('other') && (
            <Input
              placeholder="Укажите другое чувство..."
              {...form.register('emotionOther')}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label>Как обычно вы реагируете, если верите этой мысли?</Label>
          <div className="space-y-2 mt-2">
            {reactions.map((reaction) => (
              <label key={reaction.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('reactions').includes(reaction.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('reactions');
                    if (checked) {
                      form.setValue('reactions', [...current, reaction.value]);
                    } else {
                      form.setValue('reactions', current.filter(r => r !== reaction.value));
                    }
                  }}
                />
                <span>{reaction.label}</span>
              </label>
            ))}
          </div>
          {form.watch('reactions').includes('other') && (
            <Input
              placeholder="Опишите другую реакцию..."
              {...form.register('reactionOther')}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5Emotions;
