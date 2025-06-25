
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step7CrisisSupportProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step7CrisisSupport: React.FC<Step7CrisisSupportProps> = ({ onNext, onPrev }) => {
  return (
    <div className="space-y-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">
            🆘 Кризисная поддержка
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Этот блок включает план действий в трудные моменты и техники экстренной самопомощи.
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
          Далее: Долгосрочное наблюдение
        </Button>
      </div>
    </div>
  );
};

export default Step7CrisisSupport;
