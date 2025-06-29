
import React from 'react';
import EmotionSelector from '../EmotionSelector';
import { MoodStepProps } from './types';

interface EmotionsStepProps extends MoodStepProps {
  currentMood: number;
  selectedEmotions: Array<{name: string; intensity: number}>;
  onEmotionsChange: (emotions: Array<{name: string; intensity: number}>) => void;
}

const EmotionsStep = ({ currentMood, selectedEmotions, onEmotionsChange }: EmotionsStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">
        Попробуй теперь описать, какие эмоции и чувства преобладали сегодня?
      </h3>
      
      <EmotionSelector
        currentMood={currentMood}
        onEmotionsChange={onEmotionsChange}
        selectedEmotions={selectedEmotions}
      />
    </div>
  );
};

export default EmotionsStep;
