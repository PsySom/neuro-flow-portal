
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step5OvercomingAvoidanceProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step5OvercomingAvoidance: React.FC<Step5OvercomingAvoidanceProps> = ({ 
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

  const handleTaskStepChange = (index: number, value: string) => {
    const currentSteps = data.taskSteps || [];
    const newSteps = [...currentSteps];
    newSteps[index] = value;
    onDataChange('taskSteps', newSteps);
  };

  const addTaskStep = () => {
    const currentSteps = data.taskSteps || [];
    onDataChange('taskSteps', [...currentSteps, '']);
  };

  const removeTaskStep = (index: number) => {
    const currentSteps = data.taskSteps || [];
    onDataChange('taskSteps', currentSteps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">
            🚪 Преодоление избегающего поведения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-orange-700">
            Избегание — это защитная реакция. Замечаем без осуждения.
          </p>

          {/* Замечание паттернов избегания */}
          <Card className="border-orange-300 bg-white">
            <CardHeader>
              <CardTitle className="text-orange-900 text-lg">
                🔍 Замечание паттернов избегания
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Что избегаю */}
              <div>
                <Label className="text-base font-medium">Дела и обязанности</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Работа/учеба',
                    'Домашние дела',
                    'Важные звонки',
                    'Оплата счетов',
                    'Забота о здоровье',
                    'Планирование будущего'
                  ].map((task) => (
                    <div key={task} className="flex items-center space-x-2">
                      <Checkbox
                        id={task}
                        checked={data.avoidedTasks?.includes(task) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('avoidedTasks', task, checked as boolean)
                        }
                      />
                      <Label htmlFor={task} className="text-sm">{task}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Социальные ситуации</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Встречи с друзьями',
                    'Семейные собрания',
                    'Новые знакомства',
                    'Разговоры по телефону',
                    'Выход из дома',
                    'Просьбы о помощи'
                  ].map((social) => (
                    <div key={social} className="flex items-center space-x-2">
                      <Checkbox
                        id={social}
                        checked={data.avoidedSocial?.includes(social) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('avoidedSocial', social, checked as boolean)
                        }
                      />
                      <Label htmlFor={social} className="text-sm">{social}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Эмоциональные вызовы</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Разговоры о чувствах',
                    'Конфликты',
                    'Принятие решений',
                    'Выражение потребностей',
                    'Установка границ'
                  ].map((emotional) => (
                    <div key={emotional} className="flex items-center space-x-2">
                      <Checkbox
                        id={emotional}
                        checked={data.avoidedEmotional?.includes(emotional) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('avoidedEmotional', emotional, checked as boolean)
                        }
                      />
                      <Label htmlFor={emotional} className="text-sm">{emotional}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Проявления избегания */}
              <div>
                <Label className="text-base font-medium">Как проявляется избегание</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Бесконечно листаю соцсети',
                    'Смотрю сериалы/видео',
                    'Сплю больше необходимого',
                    'Ем от скуки',
                    'Убираюсь (откладывая главное)',
                    'Играю в игры',
                    'Читаю все подряд',
                    'Жалуюсь на проблемы'
                  ].map((manifestation) => (
                    <div key={manifestation} className="flex items-center space-x-2">
                      <Checkbox
                        id={manifestation}
                        checked={data.avoidanceManifestations?.includes(manifestation) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('avoidanceManifestations', manifestation, checked as boolean)
                        }
                      />
                      <Label htmlFor={manifestation} className="text-sm">{manifestation}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Причины избегания */}
              <div>
                <Label className="text-base font-medium">Что стоит за избеганием</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Страх не справиться',
                    'Перфекционизм ("лучше не делать, чем плохо")',
                    'Усталость и истощение',
                    'Страх критики',
                    'Неуверенность в себе',
                    'Ощущение бессмысленности',
                    'Тревога о результате',
                    'Депрессивная апатия'
                  ].map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <Checkbox
                        id={reason}
                        checked={data.avoidanceReasons?.includes(reason) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('avoidanceReasons', reason, checked as boolean)
                        }
                      />
                      <Label htmlFor={reason} className="text-sm">{reason}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Мягкое преодоление избегания */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">
                🏗️ Мягкое преодоление избегания
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Задача, которую избегаю больше всего</Label>
                <Input
                  value={data.mainAvoidedTask || ''}
                  onChange={(e) => onDataChange('mainAvoidedTask', e.target.value)}
                  placeholder="Опишите основную избегаемую задачу..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Почему эта задача важна для меня</Label>
                <Textarea
                  value={data.taskImportance || ''}
                  onChange={(e) => onDataChange('taskImportance', e.target.value)}
                  placeholder="Объясните важность задачи..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Какие страхи связаны с этой задачей</Label>
                <Textarea
                  value={data.taskFears || ''}
                  onChange={(e) => onDataChange('taskFears', e.target.value)}
                  placeholder="Опишите свои страхи..."
                  className="mt-2"
                />
              </div>

              {/* Разбивка на микро-шаги */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">Разбивка на микро-шаги</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addTaskStep}
                  >
                    Добавить шаг
                  </Button>
                </div>
                {(data.taskSteps || []).map((step, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={step}
                      onChange={(e) => handleTaskStepChange(index, e.target.value)}
                      placeholder={`Шаг ${index + 1}...`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTaskStep(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>

              <div>
                <Label>Самый маленький первый шаг, который точно смогу сделать</Label>
                <Input
                  value={data.smallestStep || ''}
                  onChange={(e) => onDataChange('smallestStep', e.target.value)}
                  placeholder="Опишите минимальный первый шаг..."
                  className="mt-2"
                />
              </div>

              {/* Система поддержки */}
              <div>
                <Label className="text-base font-medium">Что поможет начать</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    'Включить приятную музыку',
                    'Приготовить любимый напиток',
                    'Попросить друга "посидеть рядом"',
                    'Пообещать себе награду',
                    'Сделать это в хорошем настроении',
                    'Установить таймер на 15 минут'
                  ].map((strategy) => (
                    <div key={strategy} className="flex items-center space-x-2">
                      <Checkbox
                        id={strategy}
                        checked={data.supportStrategies?.includes(strategy) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('supportStrategies', strategy, checked as boolean)
                        }
                      />
                      <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Работа с перфекционизмом */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800 text-lg">
                🏆 Работа с перфекционизмом
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Перфекционистские установки</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {[
                    'Если не идеально, то лучше не делать',
                    'Люди подумают, что я некомпетентен/на',
                    'У меня должно получиться с первого раза',
                    'Я не могу показать, что не знаю/не умею',
                    'Ошибка = провал'
                  ].map((thought) => (
                    <div key={thought} className="flex items-center space-x-2">
                      <Checkbox
                        id={thought}
                        checked={data.perfectionistThoughts?.includes(thought) || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('perfectionistThoughts', thought, checked as boolean)
                        }
                      />
                      <Label htmlFor={thought} className="text-sm">{thought}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Задача, где могу практиковать "достаточно хорошо"</Label>
                <Input
                  value={data.goodEnoughTask || ''}
                  onChange={(e) => onDataChange('goodEnoughTask', e.target.value)}
                  placeholder="Выберите задачу для практики..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Критерий "достаточно хорошо" для этой задачи</Label>
                <Textarea
                  value={data.goodEnoughCriteria || ''}
                  onChange={(e) => onDataChange('goodEnoughCriteria', e.target.value)}
                  placeholder="Определите критерии 'достаточно хорошо'..."
                  className="mt-2"
                />
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Напоминание:</strong> Лучше сделанное на 70%, чем не сделанное на 100%.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
        <Button onClick={onNext}>
          Далее: Планирование восстановления
        </Button>
      </div>
    </div>
  );
};

export default Step5OvercomingAvoidance;
