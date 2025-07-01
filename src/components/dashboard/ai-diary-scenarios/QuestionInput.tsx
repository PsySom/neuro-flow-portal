
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from './types';

interface QuestionInputProps {
  question: Question;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  onSubmitResponse: () => void;
}

const QuestionInput: React.FC<QuestionInputProps> = ({
  question,
  currentResponse,
  setCurrentResponse,
  onSubmitResponse
}) => {
  const isResponseValid = useMemo(() => {
    if (currentResponse === '' || currentResponse === null || currentResponse === undefined) {
      return false;
    }
    if (Array.isArray(currentResponse)) {
      return currentResponse.length > 0;
    }
    return true;
  }, [currentResponse]);

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4 animate-slide-up-fade">
            <Slider
              value={[typeof currentResponse === 'number' ? currentResponse : question.scaleRange?.min || 0]}
              onValueChange={(value) => setCurrentResponse(value[0])}
              min={question.scaleRange?.min || 0}
              max={question.scaleRange?.max || 10}
              step={question.scaleRange?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.scaleRange?.min || 0}</span>
              <span className="font-medium">
                Значение: {typeof currentResponse === 'number' ? currentResponse : question.scaleRange?.min || 0}
              </span>
              <span>{question.scaleRange?.max || 10}</span>
            </div>
          </div>
        );

      case 'emoji-scale':
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

      case 'multiple-choice':
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

      case 'multi-select':
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
                        setCurrentResponse([...current, option.value]);
                      } else {
                        setCurrentResponse(current.filter((v) => v !== option.value));
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

      case 'text':
        return (
          <div className="space-y-2 animate-slide-up-fade">
            <Textarea
              placeholder="Поделитесь своими мыслями..."
              value={typeof currentResponse === 'string' ? currentResponse : ''}
              onChange={(e) => setCurrentResponse(e.target.value)}
              rows={4}
              className="w-full transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderSubmitButton = () => {
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

  return (
    <>
      {renderQuestionInput()}
      {renderSubmitButton()}
    </>
  );
};

export default QuestionInput;
