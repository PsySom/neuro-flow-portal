
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step6RecoveryPlanningProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step6RecoveryPlanning: React.FC<Step6RecoveryPlanningProps> = ({ 
  data, 
  onDataChange, 
  onNext, 
  onPrev 
}) => {
  const handleJoyChange = (category: string, joyType: 'quickJoys' | 'mediumJoys', items: string[]) => {
    onDataChange(joyType, {
      ...data[joyType],
      [category]: items
    });
  };

  const handleWeeklyPlanChange = (day: string, activity: string) => {
    onDataChange('weeklyPlan', {
      ...data.weeklyPlan,
      [day]: activity
    });
  };

  const handleBigJoyChange = (index: number, value: string) => {
    const currentJoys = data.bigJoys || [];
    const newJoys = [...currentJoys];
    newJoys[index] = value;
    onDataChange('bigJoys', newJoys);
  };

  const addBigJoy = () => {
    const currentJoys = data.bigJoys || [];
    onDataChange('bigJoys', [...currentJoys, '']);
  };

  const removeBigJoy = (index: number) => {
    const currentJoys = data.bigJoys || [];
    onDataChange('bigJoys', currentJoys.filter((_, i) => i !== index));
  };

  const JoyCategory = ({ 
    title, 
    category, 
    joyType, 
    suggestions 
  }: { 
    title: string; 
    category: string; 
    joyType: 'quickJoys' | 'mediumJoys'; 
    suggestions: string[] 
  }) => (
    <div>
      <Label className="text-base font-medium">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {suggestions.map((suggestion) => (
          <div key={suggestion} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${suggestion}`}
              checked={data[joyType]?.[category]?.includes(suggestion) || false}
              onCheckedChange={(checked) => {
                const currentItems = data[joyType]?.[category] || [];
                const newItems = checked 
                  ? [...currentItems, suggestion]
                  : currentItems.filter(item => item !== suggestion);
                handleJoyChange(category, joyType, newItems);
              }}
            />
            <Label htmlFor={`${category}-${suggestion}`} className="text-sm">{suggestion}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="border-teal-200 bg-teal-50">
        <CardHeader>
          <CardTitle className="text-teal-800">
            🌸 Планирование восстановления и радости
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-teal-700">
            Создание личной коллекции того, что может принести хоть немного радости или покоя.
          </p>

          {/* Банк приятных активностей */}
          <Card className="border-teal-300 bg-white">
            <CardHeader>
              <CardTitle className="text-teal-900 text-lg">
                🎨 Банк приятных активностей
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Быстрые радости (5-15 минут)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <JoyCategory
                    title="Для тела"
                    category="body"
                    joyType="quickJoys"
                    suggestions={[
                      'Теплый душ/ванна',
                      'Растяжка',
                      'Массаж рук или лица',
                      'Ароматный чай/кофе',
                      'Удобная поза под пледом'
                    ]}
                  />

                  <JoyCategory
                    title="Для души"
                    category="soul"
                    joyType="quickJoys"
                    suggestions={[
                      'Любимая музыка',
                      'Смешное видео',
                      'Красивые картинки',
                      'Медитация',
                      'Дыхательные упражнения',
                      'Молитва'
                    ]}
                  />

                  <JoyCategory
                    title="Для ума"
                    category="mind"
                    joyType="quickJoys"
                    suggestions={[
                      'Чтение нескольких страниц',
                      'Головоломка',
                      'Обучающее видео',
                      'Планирование чего-то приятного',
                      'Написание мыслей'
                    ]}
                  />

                  <JoyCategory
                    title="Для связи"
                    category="connection"
                    joyType="quickJoys"
                    suggestions={[
                      'Сообщение близкому',
                      'Обнимание домашнего животного',
                      'Звонок другу',
                      'Забота о растении'
                    ]}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Средние радости (30-90 минут)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <JoyCategory
                    title="Творчество"
                    category="creativity"
                    joyType="mediumJoys"
                    suggestions={[
                      'Рисование/раскрашивание',
                      'Приготовление вкусной еды',
                      'Рукоделие',
                      'Фотографирование',
                      'Танцы'
                    ]}
                  />

                  <JoyCategory
                    title="Развлечения"
                    category="entertainment"
                    joyType="mediumJoys"
                    suggestions={[
                      'Фильм/сериал',
                      'Игра',
                      'Книга',
                      'Подкасты',
                      'Музеи онлайн',
                      'Виртуальные экскурсии'
                    ]}
                  />

                  <JoyCategory
                    title="Активность"
                    category="activity"
                    joyType="mediumJoys"
                    suggestions={[
                      'Прогулка в приятном месте',
                      'Йога',
                      'Плавание',
                      'Велосипед',
                      'Садоводство',
                      'Уборка как медитация'
                    ]}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-lg font-semibold text-teal-800">Большие радости (2+ часа)</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addBigJoy}
                  >
                    Добавить
                  </Button>
                </div>
                {(data.bigJoys || []).map((joy, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={joy}
                      onChange={(e) => handleBigJoyChange(index, e.target.value)}
                      placeholder={`Большая радость ${index + 1}...`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBigJoy(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Планирование недели заботы */}
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="text-pink-800 text-lg">
                📅 Планирование недели заботы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Ежедневные "витамины счастья"</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    'Понедельник',
                    'Вторник', 
                    'Среда',
                    'Четверг',
                    'Пятница',
                    'Суббота',
                    'Воскресенье'
                  ].map((day) => (
                    <div key={day}>
                      <Label className="text-sm font-medium">{day}</Label>
                      <Input
                        value={data.weeklyPlan?.[day] || ''}
                        onChange={(e) => handleWeeklyPlanChange(day, e.target.value)}
                        placeholder="Одна маленькая радость..."
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Время дня, когда особенно нужна поддержка</Label>
                <Input
                  value={data.recoveryTime || ''}
                  onChange={(e) => onDataChange('recoveryTime', e.target.value)}
                  placeholder="Например: утро, обед, вечер..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Для этого времени планирую</Label>
                <Textarea
                  value={data.recoveryPlan || ''}
                  onChange={(e) => onDataChange('recoveryPlan', e.target.value)}
                  placeholder="Опишите план поддержки для сложного времени дня..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-teal-100 p-4 rounded-lg">
            <p className="text-sm text-teal-800">
              <strong>Напоминание:</strong> Радость не обязательно должна быть большой. 
              Иногда маленький теплый чай или несколько минут тишины могут стать 
              настоящим подарком для души.
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
          Далее: Кризисная поддержка
        </Button>
      </div>
    </div>
  );
};

export default Step6RecoveryPlanning;
