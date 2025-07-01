
import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from '../types';

interface SubmitButtonProps {
  question: Question;
  isResponseValid: boolean;
  onSubmitResponse: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  question,
  isResponseValid,
  onSubmitResponse
}) => {
  if (question.type === 'scale' || 
      question.type === 'emoji-scale' || 
      question.type === 'multiple-choice' || 
      question.type === 'multi-select') {
    return (
      <div className="flex flex-col space-y-2 animate-fade-in">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Сделайте выбор и нажмите "Далее"
        </p>
        <Button
          onClick={onSubmitResponse}
          disabled={!isResponseValid}
          className="w-fit text-white transition-all duration-300 hover:scale-105 transform"
          style={{
            background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
          }}
        >
          Далее
        </Button>
      </div>
    );
  }
  
  if (question.type === 'text') {
    return (
      <Button
        onClick={onSubmitResponse}
        disabled={!isResponseValid}
        className="w-fit text-white transition-all duration-300 hover:scale-105 transform animate-fade-in"
        style={{
          background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
        }}
      >
        Отправить ответ
      </Button>
    );
  }

  return null;
};

export default SubmitButton;
