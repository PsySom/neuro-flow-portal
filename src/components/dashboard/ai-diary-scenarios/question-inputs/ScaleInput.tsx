
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

  return (
    <div className="space-y-4 animate-slide-up-fade">
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
        <span>{question.scaleRange?.min || 0}</span>
        <span className="font-medium">
          Значение: {currentValue}
        </span>
        <span>{question.scaleRange?.max || 10}</span>
      </div>
    </div>
  );
};

export default ScaleInput;
