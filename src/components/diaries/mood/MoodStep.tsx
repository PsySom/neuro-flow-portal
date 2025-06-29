
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { getMoodEmoji, getMoodZone } from '../moodDiaryUtils';
import { MoodStepProps } from './types';

interface MoodStepComponentProps extends MoodStepProps {
  moodValue: number[];
  onMoodChange: (value: number[]) => void;
}

const MoodStep = ({ form, moodValue, onMoodChange }: MoodStepComponentProps) => {
  const currentMood = moodValue[0];
  const moodEmoji = getMoodEmoji(currentMood);
  const moodZone = getMoodZone(currentMood);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">
          Пожалуйста, прислушайся к себе и оцени, какое у тебя сейчас настроение
        </h3>
        
        <div className="flex justify-center mb-6">
          <div className="text-6xl">
            {moodEmoji}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mb-4">
          <Slider
            value={moodValue}
            onValueChange={onMoodChange}
            min={-5}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>😞 -5</span>
            <span>😐 0</span>
            <span>🤩 +5</span>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${moodZone.color}`}>
          <p className="text-sm font-medium">{moodZone.description}</p>
          <p className="text-lg font-bold">Настроение: {currentMood}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="moodComment">
          Можешь коротко описать, что особенно влияет на твое настроение сейчас?
        </Label>
        <Input
          id="moodComment"
          placeholder="Опиши свои мысли..."
          {...form.register('moodComment')}
        />
      </div>
    </div>
  );
};

export default MoodStep;
