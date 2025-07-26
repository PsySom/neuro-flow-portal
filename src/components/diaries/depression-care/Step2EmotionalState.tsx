
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

interface Step2EmotionalStateProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2EmotionalState: React.FC<Step2EmotionalStateProps> = ({ 
  data, 
  onDataChange, 
  onNext, 
  onPrev 
}) => {
  const handleEmotionChange = (emotion: string, value: number) => {
    onDataChange('emotions', {
      ...data.emotions,
      [emotion]: value
    });
  };

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
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">
            💙 Работа с эмоциональным состоянием
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Углубленная рефлексия настроения */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Углубленная рефлексия настроения
            </h3>
            <p className="text-sm text-blue-700">
              Заполняется по желанию, когда есть потребность разобраться в своих чувствах.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label>Основное настроение (-10 до +10)</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[data.currentMood || 0]}
                    onValueChange={(value) => onDataChange('currentMood', value[0])}
                    min={-10}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    Текущее значение: {data.currentMood || 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Сложные эмоции (1-10)</Label>
                  <div className="space-y-3 mt-2">
                    {[
                      'Грусть/печаль',
                      'Тревога/беспокойство', 
                      'Злость/раздражение',
                      'Апатия/безразличие',
                      'Вина',
                      'Стыд',
                      'Одиночество',
                      'Безнадежность',
                      'Страх',
                      'Разочарование'
                    ].map((emotion) => (
                      <div key={emotion} className="flex items-center space-x-3">
                        <Label className="min-w-0 flex-1 text-sm">{emotion}</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          className="w-16"
                          value={data.emotions?.[emotion] || ''}
                          onChange={(e) => handleEmotionChange(emotion, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Поддерживающие эмоции (1-10)</Label>
                  <div className="space-y-3 mt-2">
                    {[
                      'Спокойствие',
                      'Благодарность',
                      'Принятие',
                      'Надежда',
                      'Любопытство',
                      'Нежность к себе'
                    ].map((emotion) => (
                      <div key={emotion} className="flex items-center space-x-3">
                        <Label className="min-w-0 flex-1 text-sm">{emotion}</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          className="w-16"
                          value={data.emotions?.[emotion] || ''}
                          onChange={(e) => handleEmotionChange(emotion, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Что могло повлиять на настроение</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    'События сегодня',
                    'Воспоминания',
                    'Мысли о будущем',
                    'Физическое самочувствие',
                    'Погода',
                    'Общение с людьми',
                    'Усталость',
                    'Гормональные изменения',
                    'Непонятно откуда'
                  ].map((trigger) => (
                    <div key={trigger} className="flex items-center space-x-2">
                      <Checkbox
                        id={trigger}
                        checked={data.moodTriggers?.includes(trigger) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('moodTriggers', trigger, checked as boolean)
                        }
                      />
                      <Label htmlFor={trigger} className="text-sm">{trigger}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Если есть конкретная ситуация, которая повлияла</Label>
                <Textarea
                  value={data.specificSituation || ''}
                  onChange={(e) => onDataChange('specificSituation', e.target.value)}
                  placeholder="Опишите ситуацию..."
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Работа с тревогой */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 text-lg">
                🌊 Работа с тревогой и паникой
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Уровень тревоги сейчас (1-10)</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[data.anxietyLevel || 1]}
                    onValueChange={(value) => onDataChange('anxietyLevel', value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    Уровень: {data.anxietyLevel || 1}
                  </div>
                </div>
              </div>

              <div>
                <Label>Где чувствую тревогу в теле</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    'Сжимается грудь',
                    'Комок в горле',
                    'Напряжение в плечах',
                    'Дрожь в руках',
                    'Учащенное сердцебиение',
                    'Тошнота',
                    'Головокружение',
                    'Потливость',
                    'Трудно дышать'
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={data.anxietySymptoms?.includes(symptom) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('anxietySymptoms', symptom, checked as boolean)
                        }
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-3">Техника 5-4-3-2-1 (заземление)</h4>
                <div className="space-y-3">
                  <div>
                    <Label>5 вещей, которые ВИЖУ</Label>
                    <Input
                      value={data.grounding?.see || ''}
                      onChange={(e) => onDataChange('grounding', {
                        ...data.grounding,
                        see: e.target.value
                      })}
                      placeholder="Перечислите через запятую..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>4 вещи, которых КАСАЮСЬ</Label>
                    <Input
                      value={data.grounding?.touch || ''}
                      onChange={(e) => onDataChange('grounding', {
                        ...data.grounding,
                        touch: e.target.value
                      })}
                      placeholder="Перечислите через запятую..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>3 звука, которые СЛЫШУ</Label>
                    <Input
                      value={data.grounding?.hear || ''}
                      onChange={(e) => onDataChange('grounding', {
                        ...data.grounding,
                        hear: e.target.value
                      })}
                      placeholder="Перечислите через запятую..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>2 запаха, которые ЧУВСТВУЮ</Label>
                    <Input
                      value={data.grounding?.smell || ''}
                      onChange={(e) => onDataChange('grounding', {
                        ...data.grounding,
                        smell: e.target.value
                      })}
                      placeholder="Перечислите через запятую..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>1 вкус во рту</Label>
                    <Input
                      value={data.grounding?.taste || ''}
                      onChange={(e) => onDataChange('grounding', {
                        ...data.grounding,
                        taste: e.target.value
                      })}
                      placeholder="Опишите вкус..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>О чем тревожусь (основной предмет тревоги)</Label>
                <Textarea
                  value={data.anxietySubject || ''}
                  onChange={(e) => onDataChange('anxietySubject', e.target.value)}
                  placeholder="Опишите основные тревоги..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Напоминание:</strong> Все чувства имеют право на существование. 
              Они приходят и уходят, как погода. Тревога и другие сложные эмоции — 
              это естественная реакция на стресс, и с ними можно работать.
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
          Далее: Работа с мыслями
        </Button>
      </div>
    </div>
  );
};

export default Step2EmotionalState;
