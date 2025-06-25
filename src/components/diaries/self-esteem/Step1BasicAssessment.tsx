
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SelfEsteemDiaryData } from './types';

interface Step1Props {
  data: SelfEsteemDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
}

const Step1BasicAssessment: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Базовая самооценка дня
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            1. Оцени, насколько ты доволен собой сегодня
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Используй шкалу от -10 (максимальное недовольство) до +10 (максимальное довольство)
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">-10</span>
            <input
              type="range"
              min="-10"
              max="10"
              value={data.selfSatisfaction}
              onChange={(e) => onDataChange('selfSatisfaction', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">+10</span>
          </div>
          <div className="text-center mt-2">
            <span className="font-medium text-lg">{data.selfSatisfaction}</span>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            2. Оцени, насколько ты доволен своими процессами сегодня
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            (тем, как ты действовал, организовывал, реагировал и т.д.). Шкала: от -10 до +10
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">-10</span>
            <input
              type="range"
              min="-10"
              max="10"
              value={data.processSatisfaction}
              onChange={(e) => onDataChange('processSatisfaction', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">+10</span>
          </div>
          <div className="text-center mt-2">
            <span className="font-medium text-lg">{data.processSatisfaction}</span>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            3. Опиши главное событие или ощущение сегодняшнего дня
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Что именно было значимым, вызвало эмоции или мысли о себе?
          </p>
          <Textarea
            value={data.mainEvent}
            onChange={(e) => onDataChange('mainEvent', e.target.value)}
            placeholder="Опишите главное событие или ощущение дня..."
            className="min-h-[100px]"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Важно помнить:</h4>
          <p className="text-blue-800 text-sm">
            Дневник самооценки поможет вам лучше понять свои чувства и мысли. 
            Будьте честны с собой, но помните — вы достойны сострадания и поддержки.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1BasicAssessment;
