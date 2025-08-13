import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TestSectionProps {
  item: {
    title: string;
    instructions?: string;
    questions?: string[] | { question: string; options: string[]; }[];
    responseFormat?: string;
  };
  answers: {[key: number]: string};
  testResult: string;
  showResult: boolean;
  onAnswerChange: (questionIndex: number, answer: string) => void;
  onCalculateResult: () => void;
}

const TestSection: React.FC<TestSectionProps> = ({
  item,
  answers,
  testResult,
  showResult,
  onAnswerChange,
  onCalculateResult
}) => {
  if (!item.questions) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Тест</h3>
        
        {item.instructions && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Инструкция:</h4>
            <p className="text-sm text-gray-700">{item.instructions}</p>
          </div>
        )}

        <div className="space-y-6">
          {item.questions.map((questionData, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">
                {index + 1}. {typeof questionData === 'string' ? questionData : questionData.question}
              </h4>
              
              {typeof questionData === 'object' && 'options' in questionData ? (
                <RadioGroup
                  value={answers[index] || ''}
                  onValueChange={(value) => onAnswerChange(index, value)}
                >
                  {questionData.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${index}_${optionIndex}`} />
                      <Label htmlFor={`q${index}_${optionIndex}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="Ваш ответ..."
                  value={answers[index] || ''}
                  onChange={(e) => onAnswerChange(index, e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
          ))}
        </div>

        <Button onClick={onCalculateResult} className="mt-6">
          Получить результат
        </Button>

        {showResult && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">Результат теста:</h4>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestSection;