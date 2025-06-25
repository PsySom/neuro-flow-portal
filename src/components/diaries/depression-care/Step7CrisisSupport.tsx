
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertTriangle, Phone } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step7CrisisSupportProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step7CrisisSupport: React.FC<Step7CrisisSupportProps> = ({ 
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

  const handleImmediateHelpChange = (timeframe: string, items: string[]) => {
    onDataChange('immediateHelp', {
      ...data.immediateHelp,
      [timeframe]: items
    });
  };

  const handleSupportNetworkChange = (person: string, field: string, value: string) => {
    onDataChange('supportNetwork', {
      ...data.supportNetwork,
      [person]: {
        ...data.supportNetwork?.[person],
        [field]: value
      }
    });
  };

  const ImmediateHelpSection = ({ 
    timeframe, 
    title, 
    suggestions 
  }: { 
    timeframe: string; 
    title: string; 
    suggestions: string[] 
  }) => (
    <div>
      <Label className="text-base font-medium">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {suggestions.map((suggestion) => (
          <div key={suggestion} className="flex items-center space-x-2">
            <Checkbox
              id={`${timeframe}-${suggestion}`}
              checked={data.immediateHelp?.[timeframe]?.includes(suggestion) || false}
              onCheckedChange={(checked) => {
                const currentItems = data.immediateHelp?.[timeframe] || [];
                const newItems = checked 
                  ? [...currentItems, suggestion]
                  : currentItems.filter(item => item !== suggestion);
                handleImmediateHelpChange(timeframe, newItems);
              }}
            />
            <Label htmlFor={`${timeframe}-${suggestion}`} className="text-sm">{suggestion}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            🆘 Кризисная поддержка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-red-700">
            План действий в трудные моменты и техники экстренной самопомощи.
          </p>

          {/* Признаки кризисного состояния */}
          <Card className="border-red-300 bg-white">
            <CardHeader>
              <CardTitle className="text-red-900 text-lg">
                🚨 Когда все очень плохо
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Мои признаки кризисного состояния</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Настроение -7 и ниже несколько дней',
                    'Мысли о том, что "лучше бы меня не было"',
                    'Полная потеря интереса ко всему',
                    'Невозможность встать с кровати',
                    'Мысли о самоповреждении',
                    'Чувство полной безнадежности'
                  ].map((signal) => (
                    <div key={signal} className="flex items-center space-x-2">
                      <Checkbox
                        id={signal}
                        checked={data.crisisSignals?.includes(signal) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('crisisSignals', signal, checked as boolean)
                        }
                      />
                      <Label htmlFor={signal} className="text-sm">{signal}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Немедленная помощь себе */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900 text-lg">
                ⚡ Немедленная помощь себе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-orange-700">
                Когда все очень плохо, я делаю:
              </p>

              <ImmediateHelpSection
                timeframe="first5min"
                title="В первые 5 минут"
                suggestions={[
                  'Глубоко дышу (4 счета вдох, 6 счетов выдох)',
                  'Пью холодную воду',
                  'Выхожу на свежий воздух или к окну',
                  'Включаю успокаивающую музыку',
                  'Обнимаю подушку или мягкую игрушку'
                ]}
              />

              <ImmediateHelpSection
                timeframe="first30min"
                title="В первые 30 минут"
                suggestions={[
                  'Звоню близкому человеку',
                  'Принимаю теплый душ',
                  'Пью горячий чай',
                  'Смотрю что-то успокаивающее',
                  'Пишу о своих чувствах'
                ]}
              />

              <ImmediateHelpSection
                timeframe="first2hours"
                title="В первые 2 часа"
                suggestions={[
                  'Иду к людям (магазин, парк, кафе)',
                  'Делаю самое базовое (поем, приведу себя в порядок)',
                  'Звоню на горячую линию помощи',
                  'Обращаюсь к специалисту'
                ]}
              />
            </CardContent>
          </Card>

          {/* Сеть поддержки */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                📞 Моя сеть поддержки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-blue-700">
                Люди, которым могу написать/позвонить:
              </p>

              {/* Близкий человек #1 */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-3">Близкий человек #1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Имя</Label>
                    <Input
                      value={data.supportNetwork?.person1?.name || ''}
                      onChange={(e) => handleSupportNetworkChange('person1', 'name', e.target.value)}
                      placeholder="Имя контакта..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <Input
                      value={data.supportNetwork?.person1?.phone || ''}
                      onChange={(e) => handleSupportNetworkChange('person1', 'phone', e.target.value)}
                      placeholder="Номер телефона..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Когда лучше звонить</Label>
                    <Input
                      value={data.supportNetwork?.person1?.bestTime || ''}
                      onChange={(e) => handleSupportNetworkChange('person1', 'bestTime', e.target.value)}
                      placeholder="Время..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Близкий человек #2 */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-3">Близкий человек #2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Имя</Label>
                    <Input
                      value={data.supportNetwork?.person2?.name || ''}
                      onChange={(e) => handleSupportNetworkChange('person2', 'name', e.target.value)}
                      placeholder="Имя контакта..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <Input
                      value={data.supportNetwork?.person2?.phone || ''}
                      onChange={(e) => handleSupportNetworkChange('person2', 'phone', e.target.value)}
                      placeholder="Номер телефона..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Когда лучше звонить</Label>
                    <Input
                      value={data.supportNetwork?.person2?.bestTime || ''}
                      onChange={(e) => handleSupportNetworkChange('person2', 'bestTime', e.target.value)}
                      placeholder="Время..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Специалист */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-blue-900 mb-3">Специалист (психолог/врач)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Имя</Label>
                    <Input
                      value={data.supportNetwork?.professional?.name || ''}
                      onChange={(e) => handleSupportNetworkChange('professional', 'name', e.target.value)}
                      placeholder="Имя специалиста..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Телефон</Label>
                    <Input
                      value={data.supportNetwork?.professional?.phone || ''}
                      onChange={(e) => handleSupportNetworkChange('professional', 'phone', e.target.value)}
                      placeholder="Номер телефона..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Запись через</Label>
                    <Input
                      value={data.supportNetwork?.professional?.bookingInfo || ''}
                      onChange={(e) => handleSupportNetworkChange('professional', 'bookingInfo', e.target.value)}
                      placeholder="Как записаться..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Важные напоминания */}
          <div className="bg-red-100 border border-red-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-900 mb-3">
              ⚠️ Важные напоминания
            </h3>
            <div className="space-y-2 text-sm text-red-800">
              <p>• <strong>Это состояние временное</strong>, даже если не ощущается таким</p>
              <p>• <strong>Горячая линия психологической помощи:</strong> 8-800-2000-122</p>
              <p>• <strong>Служба экстренной помощи:</strong> 112</p>
              <p>• <strong>При суицидальных мыслях:</strong> немедленно обратиться за помощью</p>
              <p>• <strong>Техника "отложи на 24 часа":</strong> пообещать себе подождать сутки</p>
            </div>
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
