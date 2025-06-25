
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check } from 'lucide-react';
import { SelfEsteemDiaryData } from './types';

interface Step5Props {
  data: SelfEsteemDiaryData;
  onDataChange: (field: string, value: any) => void;
  onComplete: () => void;
  onPrev: () => void;
}

const Step5Support: React.FC<Step5Props> = ({ data, onDataChange, onComplete, onPrev }) => {
  const attitudeChangeOptions = [
    'Стало легче',
    'Меньше самокритики',
    'Пока не очень, но я заметил свои чувства'
  ];

  const isNegativeAssessment = data.selfSatisfaction < 0 || data.processSatisfaction < 0;
  const isPositiveAssessment = data.selfSatisfaction >= 2 || data.processSatisfaction >= 2;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Самоподдержка и выводы
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            20. Несмотря на негативные ситуации, в чём ещё ты сегодня был достаточно хорош?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Может быть, в другой сфере или процессе — позаботился о чём-то, справился, не испортил, преодолел что-то
          </p>
          <div className="text-sm text-gray-600 mb-3">
            <p>Примеры:</p>
            <ul className="list-disc ml-4 mt-1">
              <li>Позаботился о близких/о себе</li>
              <li>Справился с рутинной задачей</li>
              <li>Сохранил спокойствие</li>
              <li>Преодолел нежелание</li>
              <li>Завершил важное дело</li>
            </ul>
          </div>
          <Textarea
            value={data.positiveAspects}
            onChange={(e) => onDataChange('positiveAspects', e.target.value)}
            placeholder="В чём я был хорош сегодня..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            21. Как бы ты позитивно оценил другого человека за это?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Примеры: «Похвалил бы за выдержку», «Поддержал бы», «Сказал бы: "Ты молодец, что не сдался"»
          </p>
          <Textarea
            value={data.positiveEvaluationOfOthers}
            onChange={(e) => onDataChange('positiveEvaluationOfOthers', e.target.value)}
            placeholder="Как оценил бы другого..."
            className="min-h-[80px]"
          />
        </div>

        {/* Альтернативные вопросы для позитивных дней */}
        {isPositiveAssessment && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-4">🌟 Для хорошего дня:</h4>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block text-yellow-900">
                  Что сегодня особенно получилось хорошо?
                </Label>
                <Textarea
                  value={data.whatWentWell}
                  onChange={(e) => onDataChange('whatWentWell', e.target.value)}
                  placeholder="Что получилось хорошо..."
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block text-yellow-900">
                  Какие свои качества или действия ты хочешь сохранить и повторять?
                </Label>
                <Textarea
                  value={data.qualitiesKeep}
                  onChange={(e) => onDataChange('qualitiesKeep', e.target.value)}
                  placeholder="Качества для сохранения..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Альтернативные вопросы для нейтральных дней */}
        {!isNegativeAssessment && !isPositiveAssessment && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">⚖️ Для нейтрального дня:</h4>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block text-gray-900">
                  Что помогло тебе остаться в равновесии?
                </Label>
                <Textarea
                  value={data.balanceFactors}
                  onChange={(e) => onDataChange('balanceFactors', e.target.value)}
                  placeholder="Факторы равновесия..."
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-2 block text-gray-900">
                  Какие процессы были стабильными, надёжными?
                </Label>
                <Textarea
                  value={data.stableProcesses}
                  onChange={(e) => onDataChange('stableProcesses', e.target.value)}
                  placeholder="Стабильные процессы..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <Label className="text-base font-medium mb-3 block">
            22. Как изменилось твоё отношение к себе после заполнения дневника?
          </Label>
          <RadioGroup
            value={data.attitudeChange}
            onValueChange={(value) => onDataChange('attitudeChange', value)}
          >
            {attitudeChangeOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`attitude-${index}`} />
                <Label htmlFor={`attitude-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Textarea
            value={data.attitudeChange.includes('Свободный ответ') ? data.attitudeChange : ''}
            onChange={(e) => onDataChange('attitudeChange', e.target.value)}
            placeholder="Свободный ответ..."
            className="mt-3 min-h-[60px]"
          />
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            23. Что хочешь взять с собой из этого дня?
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Пример: «Быть терпимее к себе», «Заметить свои успехи», «Просить поддержки», «Просто продолжать»
          </p>
          <Textarea
            value={data.takeAwayFromDay}
            onChange={(e) => onDataChange('takeAwayFromDay', e.target.value)}
            placeholder="Что беру с собой из этого дня..."
            className="min-h-[100px]"
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">🎯 Поздравляем!</h4>
          <p className="text-green-800 text-sm">
            Вы завершили работу с дневником самооценки. Это важный шаг к развитию самосострадания 
            и более здорового отношения к себе. Продолжайте практиковать осознанность и доброту к себе.
          </p>
        </div>

        <div className="flex justify-between">
          <Button onClick={onPrev} variant="outline">
            Назад
          </Button>
          <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            Завершить дневник
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step5Support;
