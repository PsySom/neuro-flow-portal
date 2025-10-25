
import React, { useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Question } from '../types';

interface ScaleInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const ScaleInput: React.FC<ScaleInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse
}) => {
  useEffect(() => {
    if (currentResponse === '' || currentResponse === null || currentResponse === undefined) {
      const initialValue = question.scaleRange?.min || 0;
      setCurrentResponse(initialValue);
    }
  }, [question, currentResponse, setCurrentResponse]);

  const currentValue = typeof currentResponse === 'number' ? currentResponse : (question.scaleRange?.min || 0);

  // Функция для получения эмодзи в зависимости от значения настроения
  const getMoodEmoji = (value: number) => {
    const min = question.scaleRange?.min || 0;
    const max = question.scaleRange?.max || 10;
    
    // Только для шкалы настроения от -5 до 5
    if (min === -5 && max === 5) {
      if (value <= -4) return '😞';
      if (value === -3) return '😔';
      if (value === -2) return '😕';
      if (value === -1) return '😐';
      if (value === 0) return '🙂';
      if (value === 1) return '😊';
      if (value === 2) return '😃';
      if (value === 3) return '😄';
      if (value === 4) return '😁';
      if (value >= 5) return '🤩';
    }
    return null;
  };

  const moodEmoji = getMoodEmoji(currentValue);

  return (
    <div className="space-y-4 animate-slide-up-fade">
      {moodEmoji && (
        <div className="flex justify-center mb-4">
          <div className="text-6xl">
            {moodEmoji}
          </div>
        </div>
      )}
      
      <Slider
        value={[currentValue]}
        onValueChange={(value) => {
          setCurrentResponse(value[0]);
        }}
        min={question.scaleRange?.min || 0}
        max={question.scaleRange?.max || 10}
        step={question.scaleRange?.step || 1}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          {question.scaleRange?.min === -5 ? '😞 -5' : question.scaleRange?.min || 0}
        </span>
        <span className="font-medium text-lg">
          {currentValue}
        </span>
        <span>
          {question.scaleRange?.max === 5 ? '🤩 +5' : question.scaleRange?.max || 10}
        </span>
      </div>
    </div>
  );
};

export default ScaleInput;
