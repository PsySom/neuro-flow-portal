
import React from 'react';
import { Question } from '../types';

interface MultipleChoiceInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse
}) => {
  return (
    <div className="space-y-3 animate-slide-up-fade">
      {question.options?.map((option, index) => (
        <button
          key={option.value}
          onClick={() => setCurrentResponse(option.value)}
          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] transform ${
            currentResponse === option.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-center space-x-3">
            {option.emoji && <span className="text-xl transition-transform duration-200">{option.emoji}</span>}
            <span className="font-medium">{option.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceInput;
