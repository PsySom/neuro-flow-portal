
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Step2Props {
  data: {
    hasCompulsions: boolean;
    compulsionDescription: string;
    compulsionTypes: string[];
    compulsionTypeOther: string;
    compulsionDuration: string;
    anxietyBefore: number;
    anxietyDuring: number;
    anxietyAfter: number;
    resistanceLevel: string;
    resistanceDescription: string;
  };
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2Compulsions: React.FC<Step2Props> = ({ data, onDataChange, onNext, onPrev }) => {
  const compulsionTypes = [
    'Мытьё рук, принятие душа',
    'Проверка дверей, окон, электроприборов',
    'Счёт, повторения, проговаривание слов',
    'Раскладка предметов по порядку/симметрии',
    'Переспрашивание, просьбы об уверении',
    'Избегание определённых мест/предметов',
    'Другое'
  ];

  const durations = [
    { value: 'less-10', label: 'Менее 10 минут' },
    { value: '10-30', label: '10–30 минут' },
    { value: '30-60', label: '30–60 минут' },
    { value: '1-2h', label: '1–2 часа' },
    { value: 'more-2h', label: 'Более 2 часов' }
  ];

  const resistanceLevels = [
    { value: 'fully', label: 'Да, полностью' },
    { value: 'partially', label: 'Да, частично' },
    { value: 'not-at-all', label: 'Нет, не смог(ла)' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Шаг 2: Ритуалы и компульсивные действия
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            2. Выполняли ли вы сегодня ритуалы или компульсивные действия в ответ на эти мысли?
          </Label>
          <RadioGroup
            value={data.hasCompulsions ? 'yes' : 'no'}
            onValueChange={(value) => onDataChange('hasCompulsions', value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="comp-yes" />
              <Label htmlFor="comp-yes">Да</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="comp-no" />
              <Label htmlFor="comp-no">Нет</Label>
            </div>
          </RadioGroup>
        </div>

        {!data.hasCompulsions && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🎉 Совет:</h4>
            <p className="text-green-800 text-sm">
              Каждый раз, когда вы удерживаетесь от ритуала — это маленькая победа! 
              Позвольте себе гордиться этим шагом, даже если тревога была сильной.
            </p>
          </div>
        )}

        {data.hasCompulsions && (
          <>
            <div>
              <Label className="text-base font-medium mb-3 block">
                2.1. Опишите ритуалы/действия
              </Label>
              <Textarea
                value={data.compulsionDescription}
                onChange={(e) => onDataChange('compulsionDescription', e.target.value)}
                placeholder="Опишите ваши ритуалы..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                2.2. Какие именно ритуалы были сегодня?
              </Label>
              <div className="space-y-3">
                {compulsionTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`comp-type-${index}`}
                      checked={data.compulsionTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onDataChange('compulsionTypes', [...data.compulsionTypes, type]);
                        } else {
                          onDataChange('compulsionTypes', data.compulsionTypes.filter(t => t !== type));
                        }
                      }}
                    />
                    <Label htmlFor={`comp-type-${index}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
                {data.compulsionTypes.includes('Другое') && (
                  <Textarea
                    value={data.compulsionTypeOther}
                    onChange={(e) => onDataChange('compulsionTypeOther', e.target.value)}
                    placeholder="Опишите другой тип ритуала..."
                    className="mt-2 min-h-[60px]"
                  />
                )}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                2.3. Сколько времени заняли ритуалы?
              </Label>
              <RadioGroup
                value={data.compulsionDuration}
                onValueChange={(value) => onDataChange('compulsionDuration', value)}
              >
                {durations.map((duration) => (
                  <div key={duration.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={duration.value} id={`comp-${duration.value}`} />
                    <Label htmlFor={`comp-${duration.value}`}>{duration.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                2.4. Оцените уровень тревоги:
              </Label>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">До ритуала:</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={data.anxietyBefore}
                      onChange={(e) => onDataChange('anxietyBefore', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-medium">{data.anxietyBefore}/10</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Во время:</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={data.anxietyDuring}
                      onChange={(e) => onDataChange('anxietyDuring', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-medium">{data.anxietyDuring}/10</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm mb-2 block">После:</Label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={data.anxietyAfter}
                      onChange={(e) => onDataChange('anxietyAfter', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-medium">{data.anxietyAfter}/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                2.5. Удалось ли вам сопротивляться ритуалу?
              </Label>
              <RadioGroup
                value={data.resistanceLevel}
                onValueChange={(value) => onDataChange('resistanceLevel', value)}
              >
                {resistanceLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value}>{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              {data.resistanceLevel && (
                <div className="mt-4">
                  <Textarea
                    value={data.resistanceDescription}
                    onChange={(e) => onDataChange('resistanceDescription', e.target.value)}
                    placeholder={
                      data.resistanceLevel === 'not-at-all' 
                        ? "Опишите, почему..." 
                        : "Опишите, что помогло сопротивляться..."
                    }
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Совет:</h4>
          <p className="text-blue-800 text-sm">
            Даже если не удалось полностью отказаться от ритуала — это не поражение! 
            Учитесь замечать малейшие моменты, когда вы хотя бы ненадолго остановились и задумались. Это уже рост!
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
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

export default Step2Compulsions;
