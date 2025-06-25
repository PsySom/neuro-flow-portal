
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step5OvercomingAvoidanceProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step5OvercomingAvoidance: React.FC<Step5OvercomingAvoidanceProps> = ({ onNext, onPrev }) => {
  return (
    <div className="space-y-8">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">
            🚪 Преодоление избегающего поведения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Этот блок включает замечание паттернов избегания и мягкое их преодоление.
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
          Далее: Планирование восстановления
        </Button>
      </div>
    </div>
  );
};

export default Step5OvercomingAvoidance;
