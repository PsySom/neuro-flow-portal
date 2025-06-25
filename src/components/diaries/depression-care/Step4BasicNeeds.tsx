
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step4BasicNeedsProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step4BasicNeeds: React.FC<Step4BasicNeedsProps> = ({ onNext, onPrev }) => {
  return (
    <div className="space-y-8">
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">
            🏠 Забота о базовых потребностях
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Этот блок включает пирамиду заботы о себе и планирование удовлетворения потребностей.
            </p>
            <p className="text-sm text-gray-500">
              Полная реализация этого шага будет добавлена в следующих обновлениях.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button onClick={onNext}>
          Далее: Преодоление избегания
        </Button>
      </div>
    </div>
  );
};

export default Step4BasicNeeds;
