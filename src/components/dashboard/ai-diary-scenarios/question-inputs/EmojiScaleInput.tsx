
import React from 'react';
import { Question } from '../types';

interface EmojiScaleInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const EmojiScaleInput: React.FC<EmojiScaleInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse
}) => {
  return (
    <div className="grid grid-cols-5 gap-3 animate-slide-up-fade">
      {question.options?.map((option, index) => (
        <button
          key={option.value}
          onClick={() => setCurrentResponse(option.value)}
          className={`p-4 rounded-lg border-2 transition-all duration-300 text-center hover:scale-110 transform ${
            currentResponse === option.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="text-3xl mb-2 transition-transform duration-200">{option.emoji}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{option.label}</div>
        </button>
      ))}
    </div>
  );
};

export default EmojiScaleInput;
