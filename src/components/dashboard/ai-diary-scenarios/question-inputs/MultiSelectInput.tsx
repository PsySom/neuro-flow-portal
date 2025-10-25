
import React from 'react';
import { Button } from '@/components/ui/button';
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
  const selectedValues = Array.isArray(currentResponse) ? currentResponse.map(String) : [];
  const maxSelect = 3; // Максимум 3 эмоции

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      setCurrentResponse(selectedValues.filter(v => v !== value));
    } else {
      if (selectedValues.length < maxSelect) {
        setCurrentResponse([...selectedValues, value]);
      }
    }
  };

  // Группируем эмоции по типу
  const positiveEmotions = question.options?.filter(opt => 
    ['joy', 'interest', 'inspiration', 'confidence', 'calmness', 'gratitude'].includes(String(opt.value))
  ) || [];
  
  const neutralEmotions = question.options?.filter(opt => 
    ['surprise', 'boredom', 'confusion', 'acceptance'].includes(String(opt.value))
  ) || [];
  
  const negativeEmotions = question.options?.filter(opt => 
    ['sadness', 'anxiety', 'resentment', 'irritation', 'anger', 'apathy', 'fatigue', 'fear'].includes(String(opt.value))
  ) || [];

  const renderEmotionGroup = (emotions: typeof question.options, title: string, bgColor: string) => {
    if (!emotions || emotions.length === 0) return null;
    
    return (
      <div className={`p-4 rounded-lg ${bgColor} mb-4`}>
        <h4 className="font-medium mb-3">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {emotions.map((option) => {
            const isSelected = selectedValues.includes(String(option.value));
            const isDisabled = !isSelected && selectedValues.length >= maxSelect;
            
            return (
              <Button
                key={option.value}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="lg"
                onClick={() => toggleOption(String(option.value))}
                disabled={isDisabled}
                className="h-auto py-3 px-4 transition-all duration-300"
              >
                {option.emoji && <span className="mr-2 text-xl">{option.emoji}</span>}
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-slide-up-fade">
      <p className="text-sm text-muted-foreground mb-4">
        Выбрано: {selectedValues.length} / {maxSelect}
      </p>
      
      {renderEmotionGroup(positiveEmotions, 'Позитивные эмоции', 'bg-yellow-50 dark:bg-yellow-900/20')}
      {renderEmotionGroup(neutralEmotions, 'Нейтральные эмоции', 'bg-gray-50 dark:bg-gray-800')}
      {renderEmotionGroup(negativeEmotions, 'Негативные эмоции', 'bg-blue-50 dark:bg-blue-900/20')}
    </div>
  );
};

export default MultiSelectInput;
