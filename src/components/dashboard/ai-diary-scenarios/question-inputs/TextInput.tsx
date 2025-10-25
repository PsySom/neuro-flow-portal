
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Question } from '../types';

interface TextInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const TextInput: React.FC<TextInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse
}) => {
  const handleSkip = () => {
    setCurrentResponse('(пропустить)');
  };

  return (
    <div className="space-y-4 animate-slide-up-fade">
      <Textarea
        value={String(currentResponse || '')}
        onChange={(e) => setCurrentResponse(e.target.value)}
        placeholder="Введите ваш ответ или нажмите 'Пропустить'..."
        rows={4}
        className="w-full resize-none transition-all duration-200 focus:scale-[1.01]"
      />
      {!question.required && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSkip}
          className="w-full sm:w-auto"
        >
          Пропустить
        </Button>
      )}
    </div>
  );
};

export default TextInput;
