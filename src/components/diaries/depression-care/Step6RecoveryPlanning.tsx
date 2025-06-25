
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step6RecoveryPlanningProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step6RecoveryPlanning: React.FC<Step6RecoveryPlanningProps> = ({ onNext, onPrev }) => {
  return (
    <div className="space-y-8">
      <Card className="border-teal-200 bg-teal-50">
        <CardHeader>
          <CardTitle className="text-teal-800">
            🌸 Планирование восстановления и радости
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Этот блок включает банк приятных активностей и планирование недели заботы.
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
          Далее: Кризисная поддержка
        </Button>
      </div>
    </div>
  );
};

export default Step6RecoveryPlanning;
