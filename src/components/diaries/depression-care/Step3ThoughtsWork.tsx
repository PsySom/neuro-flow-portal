
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step3ThoughtsWorkProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3ThoughtsWork: React.FC<Step3ThoughtsWorkProps> = ({ 
  data, 
  onDataChange, 
  onNext, 
  onPrev 
}) => {
  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = data[field] || [];
    if (checked) {
      onDataChange(field, [...currentValues, value]);
    } else {
      onDataChange(field, currentValues.filter((item: string) => item !== value));
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">
            🧠 Работа с мыслями и убеждениями
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-green-700">
            Депрессия часто сопровождается негативными мыслями, которые кажутся правдой. 
            Но мысли — это не факты.
          </p>

          {/* Замечание автоматических мыслей */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-900">
              Замечание автоматических мыслей
            </h3>

            <div>
              <Label className="text-base font-medium">Негативные мысли о себе</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  'Я никчемный/ая',
                  'У меня ничего не получается',
                  'Я плохая мать/отец/друг',
                  'Со мной что-то не так',
                  'Я обуза для близких',
                  'Я не заслуживаю хорошего'
                ].map((thought) => (
                  <div key={thought} className="flex items-center space-x-2">
                    <Checkbox
                      id={thought}
                      checked={data.negativeThoughtsAboutSelf?.includes(thought) || false}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('negativeThoughtsAboutSelf', thought, checked as boolean)
                      }
                    />
                    <Label htmlFor={thought} className="text-sm">{thought}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <Label>Другие мысли о себе</Label>
                <Input
                  value={data.otherNegativeThoughtsAboutSelf || ''}
                  onChange={(e) => onDataChange('otherNegativeThoughtsAboutSelf', e.target.value)}
                  placeholder="Опишите другие негативные мысли о себе..."
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Негативные мысли о будущем</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  'Ничего не изменится',
                  'Мне никогда не станет лучше',
                  'Это никогда не закончится',
                  'Все будет только хуже',
                  'Я не справлюсь',
                  'Я не смогу быть счастливым/ой'
                ].map((thought) => (
                  <div key={thought} className="flex items-center space-x-2">
                    <Checkbox
                      id={thought}
                      checked={data.negativeThoughtsAboutFuture?.includes(thought) || false}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('negativeThoughtsAboutFuture', thought, checked as boolean)
                      }
                    />
                    <Label htmlFor={thought} className="text-sm">{thought}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Негативные мысли о мире</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {[
                  'Никому нельзя доверять',
                  'Мир жестокий',
                  'Все плохо',
                  'Никто меня не понимает',
                  'Людям все равно',
                  'Справедливости нет'
                ].map((thought) => (
                  <div key={thought} className="flex items-center space-x-2">
                    <Checkbox
                      id={thought}
                      checked={data.negativeThoughtsAboutWorld?.includes(thought) || false}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('negativeThoughtsAboutWorld', thought, checked as boolean)
                      }
                    />
                    <Label htmlFor={thought} className="text-sm">{thought}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Работа с самой беспокоящей мыслью */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 text-lg">
                Работа с самой беспокоящей мыслью
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Выберите одну мысль, которая больше всего мучает</Label>
                <Textarea
                  value={data.mostDistressingThought || ''}
                  onChange={(e) => onDataChange('mostDistressingThought', e.target.value)}
                  placeholder="Напишите самую беспокоящую мысль..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Насколько сильно верю в эту мысль (0-100%)</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[data.beliefInThought || 50]}
                    onValueChange={(value) => onDataChange('beliefInThought', value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    Уровень убежденности: {data.beliefInThought || 50}%
                  </div>
                </div>
              </div>

              <div>
                <Label>Какие эмоции вызывает эта мысль</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    'Грусть',
                    'Тревога',
                    'Злость',
                    'Стыд',
                    'Безнадежность',
                    'Вина',
                    'Страх'
                  ].map((emotion) => (
                    <div key={emotion} className="flex items-center space-x-2">
                      <Checkbox
                        id={emotion}
                        checked={data.thoughtEmotions?.includes(emotion) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('thoughtEmotions', emotion, checked as boolean)
                        }
                      />
                      <Label htmlFor={emotion} className="text-sm">{emotion}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Факты, которые ПОДТВЕРЖДАЮТ эту мысль</Label>
                <Textarea
                  value={data.supportingEvidence || ''}
                  onChange={(e) => onDataChange('supportingEvidence', e.target.value)}
                  placeholder="Перечислите факты, которые поддерживают эту мысль..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Факты, которые ПРОТИВОРЕЧАТ этой мысли</Label>
                <Textarea
                  value={data.contradictingEvidence || ''}
                  onChange={(e) => onDataChange('contradictingEvidence', e.target.value)}
                  placeholder="Перечислите факты, которые противоречат этой мысли..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Что бы я сказал/а хорошему другу, если бы он думал так о себе</Label>
                <Textarea
                  value={data.friendAdvice || ''}
                  onChange={(e) => onDataChange('friendAdvice', e.target.value)}
                  placeholder="Какой совет дали бы другу..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Более реалистичная и добрая мысль</Label>
                <Textarea
                  value={data.balancedThought || ''}
                  onChange={(e) => onDataChange('balancedThought', e.target.value)}
                  placeholder="Сформулируйте более сбалансированную мысль..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Насколько верю в эту новую мысль (0-100%)</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[data.beliefInNewThought || 50]}
                    onValueChange={(value) => onDataChange('beliefInNewThought', value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    Уровень убежденности: {data.beliefInNewThought || 50}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Работа с циклами негативного мышления */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-900">
              Замечание паттернов мышления
            </h3>

            <div>
              <Label>Какие типы мыслей повторяются чаще всего</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {[
                  'Черно-белое мышление: "Либо идеально, либо провал"',
                  'Катастрофизация: "Это ужасно, катастрофа"',
                  'Чтение мыслей: "Он думает, что я..."',
                  'Предсказание будущего: "Точно не получится"',
                  'Обесценивание хорошего: "Это случайность"',
                  'Эмоциональные доводы: "Чувствую себя глупо, значит я глуп"',
                  'Персонализация: "Это моя вина"',
                  'Долженствование: "Я должен/обязан"'
                ].map((pattern) => (
                  <div key={pattern} className="flex items-center space-x-2">
                    <Checkbox
                      id={pattern}
                      checked={data.thinkingPatterns?.includes(pattern) || false}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('thinkingPatterns', pattern, checked as boolean)
                      }
                    />
                    <Label htmlFor={pattern} className="text-sm">{pattern}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Помните:</strong> Мысли — это не факты. Они приходят и уходят. 
              Вы можете замечать их, исследовать и выбирать, какие из них заслуживают внимания.
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
          Далее: Базовые потребности
        </Button>
      </div>
    </div>
  );
};

export default Step3ThoughtsWork;
