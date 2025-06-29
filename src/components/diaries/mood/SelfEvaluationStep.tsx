
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MoodStepProps } from './types';

const SelfEvaluationStep = ({ form }: MoodStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Самооценка дня и поддержка</h3>
      
      <div className="space-y-4">
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
