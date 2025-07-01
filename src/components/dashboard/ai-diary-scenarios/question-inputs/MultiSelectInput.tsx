
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from '../types';

interface MultiSelectInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse
}) => {
  return (
    <div className="space-y-3 animate-slide-up-fade">
      {question.options?.map((option, index) => {
        const isChecked = Array.isArray(currentResponse) && 
          currentResponse.some(val => val === option.value);
        
        return (
          <div 
            key={option.value} 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => {
                const current = Array.isArray(currentResponse) ? currentResponse : [];
                if (checked) {
                  if (typeof option.value === 'string') {
                    const stringArray = current.filter((v): v is string => typeof v === 'string');
                    setCurrentResponse([...stringArray, option.value]);
                  } else {
                    const numberArray = current.filter((v): v is number => typeof v === 'number');
                    setCurrentResponse([...numberArray, option.value]);
                  }
                } else {
                  if (typeof option.value === 'string') {
                    const stringArray = current.filter((v): v is string => typeof v === 'string');
                    setCurrentResponse(stringArray.filter((v) => v !== option.value));
                  } else {
                    const numberArray = current.filter((v): v is number => typeof v === 'number');
                    setCurrentResponse(numberArray.filter((v) => v !== option.value));
                  }
                }
              }}
              className="transition-all duration-200"
            />
            {option.emoji && <span className="text-lg transition-transform duration-200">{option.emoji}</span>}
            <span>{option.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MultiSelectInput;
