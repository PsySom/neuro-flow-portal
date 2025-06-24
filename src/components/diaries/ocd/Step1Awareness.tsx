
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Step1Props {
  data: {
    hasObsessions: boolean;
    obsessionNote: string;
    obsessionDescription: string;
    obsessionThemes: string[];
    obsessionThemeOther: string;
    obsessionDuration: string;
    anxietyLevel: number;
    obsessionSituations: string;
  };
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
}

const Step1Awareness: React.FC<Step1Props> = ({ data, onDataChange, onNext }) => {
  const themes = [
    'Страх загрязнения/заражения',
    'Сомнения (выключил ли я свет, закрыл ли дверь и т.д.)',
    'Страх причинить вред себе или другим',
    'Перфекционизм, симметрия, порядок',
    'Религиозные или моральные опасения',
    'Навязчивые числа, повторения',
    'Другое'
  ];

  const durations = [
    { value: 'less-10', label: 'Менее 10 минут' },
    { value: '10-30', label: '10–30 минут' },
    { value: '30-60', label: '30–60 минут' },
    { value: '1-2h', label: '1–2 часа' },
    { value: 'more-2h', label: 'Более 2 часов' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Шаг 1: Осознание навязчивых мыслей
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            1. Были ли у вас сегодня навязчивые мысли (обсессии)?
          </Label>
          <RadioGroup
            value={data.hasObsessions ? 'yes' : 'no'}
            onValueChange={(value) => onDataChange('hasObsessions', value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="obs-yes" />
              <Label htmlFor="obs-yes">Да</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="obs-no" />
              <Label htmlFor="obs-no">Нет</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-4">
            <Label className="text-sm text-gray-600 mb-2 block">
              Если хотите, опишите свои ощущения утром/вечером:
            </Label>
            <Textarea
              value={data.obsessionNote}
              onChange={(e) => onDataChange('obsessionNote', e.target.value)}
              placeholder="Ваши заметки..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {data.hasObsessions && (
          <>
            <div>
              <Label className="text-base font-medium mb-3 block">
                1.1. Опишите навязчивые мысли, которые возникали
              </Label>
              <Textarea
                value={data.obsessionDescription}
                onChange={(e) => onDataChange('obsessionDescription', e.target.value)}
                placeholder="Опишите ваши навязчивые мысли..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                1.2. Какие из тем наиболее актуальны? (Можно выбрать несколько)
              </Label>
              <div className="space-y-3">
                {themes.map((theme, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${index}`}
                      checked={data.obsessionThemes.includes(theme)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onDataChange('obsessionThemes', [...data.obsessionThemes, theme]);
                        } else {
                          onDataChange('obsessionThemes', data.obsessionThemes.filter(t => t !== theme));
                        }
                      }}
                    />
                    <Label htmlFor={`theme-${index}`} className="text-sm">
                      {theme}
                    </Label>
                  </div>
                ))}
                {data.obsessionThemes.includes('Другое') && (
                  <Textarea
                    value={data.obsessionThemeOther}
                    onChange={(e) => onDataChange('obsessionThemeOther', e.target.value)}
                    placeholder="Опишите другую тему..."
                    className="mt-2 min-h-[60px]"
                  />
                )}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                1.3. Сколько времени сегодня занимали эти мысли?
              </Label>
              <RadioGroup
                value={data.obsessionDuration}
                onValueChange={(value) => onDataChange('obsessionDuration', value)}
              >
                {durations.map((duration) => (
                  <div key={duration.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={duration.value} id={duration.value} />
                    <Label htmlFor={duration.value}>{duration.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                1.4. Какой уровень тревоги вы испытали? (0 — нет тревоги, 10 — максимум)
              </Label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={data.anxietyLevel}
                  onChange={(e) => onDataChange('anxietyLevel', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="font-medium text-lg">{data.anxietyLevel}/10</span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                1.5. В каких ситуациях/местах/состояниях появлялись мысли?
              </Label>
              <Textarea
                value={data.obsessionSituations}
                onChange={(e) => onDataChange('obsessionSituations', e.target.value)}
                placeholder="Опишите ситуации..."
                className="min-h-[80px]"
              />
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Совет:</h4>
          <p className="text-blue-800 text-sm">
            Навязчивые мысли не определяют вас как личность. Позвольте им быть, но не торопитесь с выводами и действиями. 
            Иногда достаточно просто наблюдать за мыслью, чтобы она ослабла.
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

export default Step1Awareness;
