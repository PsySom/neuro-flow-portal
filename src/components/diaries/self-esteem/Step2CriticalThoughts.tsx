
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SelfEsteemDiaryData } from './types';

interface Step2Props {
  data: SelfEsteemDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2CriticalThoughts: React.FC<Step2Props> = ({ data, onDataChange, onNext, onPrev }) => {
  const helpOptions = [
    'Никак',
    'Помогает быть честнее с собой',
    'Позволяет увидеть, что хочу изменить',
    'Может подстегнуть к развитию'
  ];

  const alternativeOptions = [
    'Замечать успехи',
    'Спрашивать себя: что бы я сказал другу на своём месте',
    'Пробовать относиться к себе с сочувствием'
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Моменты недовольства и критикующие мысли
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            4. Какие моменты сегодня вызвали у тебя недовольство собой?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Или ощущение, что ты не справился? Если ничего не вспоминается — напиши об этом.
          </p>
          <Textarea
            value={data.dissatisfactionMoments}
            onChange={(e) => onDataChange('dissatisfactionMoments', e.target.value)}
            placeholder="Опишите моменты недовольства собой..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            5. Какие критикующие мысли о себе у тебя возникали сегодня?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Пример: «У меня опять не получилось», «Я не собранный», «Я подвёл команду»
          </p>
          <Textarea
            value={data.selfCriticizingThoughts}
            onChange={(e) => onDataChange('selfCriticizingThoughts', e.target.value)}
            placeholder="Критикующие мысли о себе..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Критикующие мысли о других (если были):
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Пример: «Коллеги не помогли», «Меня не поняли»
          </p>
          <Textarea
            value={data.othersCriticizingThoughts}
            onChange={(e) => onDataChange('othersCriticizingThoughts', e.target.value)}
            placeholder="Критикующие мысли о других..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            6. Чем подтверждаются эти мысли?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Есть ли реальные факты? Кто ещё так думает?
          </p>
          <Textarea
            value={data.thoughtsConfirmation}
            onChange={(e) => onDataChange('thoughtsConfirmation', e.target.value)}
            placeholder="Подтверждающие факты..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            7. Чем опровергаются эти мысли?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Есть ли примеры, когда это не так? Как ещё можно относиться к ситуации?
          </p>
          <Textarea
            value={data.thoughtsRefutation}
            onChange={(e) => onDataChange('thoughtsRefutation', e.target.value)}
            placeholder="Опровергающие примеры..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            8. Как эта самокритика помогает тебе сейчас или может помочь в будущем?
          </Label>
          <RadioGroup
            value={data.selfCriticismHelp}
            onValueChange={(value) => onDataChange('selfCriticismHelp', value)}
          >
            {helpOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`help-${index}`} />
                <Label htmlFor={`help-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Textarea
            value={data.selfCriticismHelp.includes('Свободный ответ') ? data.selfCriticismHelp : ''}
            onChange={(e) => onDataChange('selfCriticismHelp', e.target.value)}
            placeholder="Свободный ответ..."
            className="mt-3 min-h-[60px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            9. Какие другие способы оценивать себя могли бы быть полезны в следующий раз?
          </Label>
          <div className="space-y-2">
            {alternativeOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`alt-${index}`}
                  checked={data.alternativeEvaluationMethods.includes(option)}
                  onChange={(e) => {
                    const current = data.alternativeEvaluationMethods || '';
                    if (e.target.checked) {
                      onDataChange('alternativeEvaluationMethods', current + (current ? ', ' : '') + option);
                    } else {
                      onDataChange('alternativeEvaluationMethods', current.replace(option, '').replace(', ,', ',').replace(/^,|,$/, ''));
                    }
                  }}
                  className="rounded"
                />
                <Label htmlFor={`alt-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
          <Textarea
            value={data.alternativeEvaluationMethods}
            onChange={(e) => onDataChange('alternativeEvaluationMethods', e.target.value)}
            placeholder="Свободный ответ..."
            className="mt-3 min-h-[60px]"
          />
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

export default Step2CriticalThoughts;
