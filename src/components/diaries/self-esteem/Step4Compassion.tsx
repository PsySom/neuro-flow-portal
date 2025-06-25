
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SelfEsteemDiaryData } from './types';

interface Step4Props {
  data: SelfEsteemDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step4Compassion: React.FC<Step4Props> = ({ data, onDataChange, onNext, onPrev }) => {
  const acceptanceOptions = [
    'Да, это часть жизни',
    'Сложно, но учусь',
    'Пока не могу'
  ];

  const universalFeelingsOptions = [
    'Да, это часть человеческого опыта',
    'Иногда сложно поверить, но так бывает'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Принятие и самосострадание
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            16. Могу ли я принять, что такие ситуации и чувства бывают у всех людей?
          </Label>
          <RadioGroup
            value={data.canAcceptFeelings}
            onValueChange={(value) => onDataChange('canAcceptFeelings', value)}
          >
            {acceptanceOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`accept-${index}`} />
                <Label htmlFor={`accept-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Textarea
            value={data.canAcceptFeelings.includes('Свободный ответ') ? data.canAcceptFeelings : ''}
            onChange={(e) => onDataChange('canAcceptFeelings', e.target.value)}
            placeholder="Свободный ответ..."
            className="mt-3 min-h-[60px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            17. Что можно сделать, чтобы лучше позаботиться о себе в такой ситуации в следующий раз?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Варианты: сделать паузу, поговорить с близким, позволить себе ошибиться
          </p>
          <Textarea
            value={data.selfCareStrategies}
            onChange={(e) => onDataChange('selfCareStrategies', e.target.value)}
            placeholder="Стратегии заботы о себе..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            18. Как можно подготовиться к подобной ситуации, учитывая имеющийся опыт?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Варианты: продумать план, попросить поддержки заранее
          </p>
          <Textarea
            value={data.preparationStrategies}
            onChange={(e) => onDataChange('preparationStrategies', e.target.value)}
            placeholder="Стратегии подготовки..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            19. Как можно помочь и поддержать себя в следующий раз?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Варианты: напомнить себе о прошлых успехах, похвалить себя
          </p>
          <Textarea
            value={data.selfSupportStrategies}
            onChange={(e) => onDataChange('selfSupportStrategies', e.target.value)}
            placeholder="Стратегии самоподдержки..."
            className="min-h-[80px]"
          />
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-4">💜 Самосострадание</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium mb-2 block text-purple-900">
                1. Осознанность: Какие чувства ты сейчас испытываешь?
              </Label>
              <p className="text-sm text-purple-700 mb-2">
                Пример: «Мне тяжело», «Я злюсь», «Мне грустно»
              </p>
              <Textarea
                value={data.currentFeelings}
                onChange={(e) => onDataChange('currentFeelings', e.target.value)}
                placeholder="Мои текущие чувства..."
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block text-purple-900">
                2. Человечность общего опыта: Могу ли я признать, что такие чувства есть у всех?
              </Label>
              <RadioGroup
                value={data.acceptUniversalFeelings}
                onValueChange={(value) => onDataChange('acceptUniversalFeelings', value)}
              >
                {universalFeelingsOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`universal-${index}`} />
                    <Label htmlFor={`universal-${index}`} className="text-sm text-purple-800">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block text-purple-900">
                3. Доброжелательное отношение к себе: Как могу проявить заботу к себе прямо сейчас?
              </Label>
              <p className="text-sm text-purple-700 mb-2">
                Сказать себе добрые слова, сделать паузу, сделать что-то приятное для себя
              </p>
              <Textarea
                value={data.selfCareActions}
                onChange={(e) => onDataChange('selfCareActions', e.target.value)}
                placeholder="Как проявлю заботу о себе..."
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-2 block text-purple-900">
                Напиши себе короткое поддерживающее послание:
              </Label>
              <p className="text-sm text-purple-700 mb-2">
                Пример: «Я достоин поддержки, даже если ошибаюсь», «Я стараюсь и это уже ценно»
              </p>
              <Textarea
                value={data.supportiveMessage}
                onChange={(e) => onDataChange('supportiveMessage', e.target.value)}
                placeholder="Моё поддерживающее послание себе..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={onPrev} variant="outline">
            Назад
          </Button>
          <Button onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4Compassion;
