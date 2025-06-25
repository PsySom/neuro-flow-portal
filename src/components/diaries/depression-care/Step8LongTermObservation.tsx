
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step8LongTermObservationProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onComplete: () => void;
  onPrev: () => void;
}

const Step8LongTermObservation: React.FC<Step8LongTermObservationProps> = ({ onComplete, onPrev }) => {
  return (
    <div className="space-y-8">
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-indigo-800">
            📊 Долгосрочное наблюдение и рост
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Этот блок включает еженедельный анализ, месячный обзор прогресса и письмо себе в будущее.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Полная реализация этого шага будет добавлена в следующих обновлениях.
            </p>
            
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🌈 Поздравляем!
              </h3>
              <p className="text-gray-600 mb-4">
                Вы прошли первый этап дневника заботливого выхода из депрессии. 
                Каждый шаг — это движение к лучшему самочувствию.
              </p>
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Завершить дневник
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>
    </div>
  );
};

export default Step8LongTermObservation;
