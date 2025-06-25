
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SelfEsteemDiaryData } from './types';

interface Step3Props {
  data: SelfEsteemDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3Reframing: React.FC<Step3Props> = ({ data, onDataChange, onNext, onPrev }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Переосмысление и поддержка
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            10. Как ещё можно относиться к этой ситуации?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Примеры: «Это не определяет меня целиком», «Любой может ошибаться», «Я учусь на опыте»
          </p>
          <Textarea
            value={data.alternativePerspective}
            onChange={(e) => onDataChange('alternativePerspective', e.target.value)}
            placeholder="Альтернативный взгляд на ситуацию..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            11. Что сделал бы на твоём месте другой человек?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Примеры: «Не стал бы винить себя», «Попросил бы помощи», «Смотрел бы на ситуацию шире»
          </p>
          <Textarea
            value={data.whatWouldOthersDo}
            onChange={(e) => onDataChange('whatWouldOthersDo', e.target.value)}
            placeholder="Что сделали бы другие..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            12. Как бы ты поддержал друга в подобной ситуации?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Примеры: «Напомнил бы о его сильных сторонах», «Похвалил бы за старания»
          </p>
          <Textarea
            value={data.supportForFriend}
            onChange={(e) => onDataChange('supportForFriend', e.target.value)}
            placeholder="Как поддержали бы друга..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            13. Что говорит тебе внутренний критик?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Пример: «Ты недостаточно стараешься», «Ты слабый»
          </p>
          <Textarea
            value={data.innerCriticVoice}
            onChange={(e) => onDataChange('innerCriticVoice', e.target.value)}
            placeholder="Голос внутреннего критика..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            14. Что бы сказал тебе друг/адвокат?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Пример: «Ты многое сделал, даже если не всё», «У тебя есть право на ошибку»
          </p>
          <Textarea
            value={data.friendAdvocateVoice}
            onChange={(e) => onDataChange('friendAdvocateVoice', e.target.value)}
            placeholder="Голос друга/адвоката..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            15. Как можно оценить эту ситуацию иначе?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Варианты: как опыт, как временную неудачу, как проявление старания
          </p>
          <Textarea
            value={data.alternativeEvaluation}
            onChange={(e) => onDataChange('alternativeEvaluation', e.target.value)}
            placeholder="Альтернативная оценка ситуации..."
            className="min-h-[80px]"
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">🌱 Помните:</h4>
          <p className="text-green-800 text-sm">
            Переосмысление ситуации не означает отрицание проблем. Это поиск более сбалансированного 
            и сострадательного взгляда на себя и свой опыт.
          </p>
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

export default Step3Reframing;
