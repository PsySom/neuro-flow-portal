
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Check, TrendingUp, Target, Heart } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step8LongTermObservationProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onComplete: () => void;
  onPrev: () => void;
}

const Step8LongTermObservation: React.FC<Step8LongTermObservationProps> = ({ 
  data, 
  onDataChange, 
  onComplete, 
  onPrev 
}) => {
  const handleWeeklyAverageChange = (field: string, value: number) => {
    onDataChange('weeklyAverages', {
      ...data.weeklyAverages,
      [field]: value
    });
  };

  const handleMonthlyProgressChange = (field: string, value: string) => {
    onDataChange('monthlyProgress', {
      ...data.monthlyProgress,
      [field]: value
    });
  };

  const handleFutureGoalChange = (field: string, value: string) => {
    onDataChange('futureGoals', {
      ...data.futureGoals,
      [field]: value
    });
  };

  const handleAchievementChange = (index: number, value: string) => {
    const currentAchievements = data.monthlyAchievements || [];
    const newAchievements = [...currentAchievements];
    newAchievements[index] = value;
    onDataChange('monthlyAchievements', newAchievements);
  };

  const addAchievement = () => {
    const currentAchievements = data.monthlyAchievements || [];
    onDataChange('monthlyAchievements', [...currentAchievements, '']);
  };

  const removeAchievement = (index: number) => {
    const currentAchievements = data.monthlyAchievements || [];
    onDataChange('monthlyAchievements', currentAchievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-indigo-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            📊 Долгосрочное наблюдение и рост
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-indigo-700">
            Еженедельный анализ, месячный обзор прогресса и планирование будущего.
          </p>

          {/* Еженедельный анализ */}
          <Card className="border-indigo-300 bg-white">
            <CardHeader>
              <CardTitle className="text-indigo-900 text-lg">
                📈 Еженедельный анализ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-indigo-800 mb-4">Средние оценки за неделю</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Настроение (-10 до +10)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[data.weeklyAverages?.mood || 0]}
                        onValueChange={(value) => handleWeeklyAverageChange('mood', value[0])}
                        min={-10}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">
                        Значение: {data.weeklyAverages?.mood || 0}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Энергия (1-10)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[data.weeklyAverages?.energy || 5]}
                        onValueChange={(value) => handleWeeklyAverageChange('energy', value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">
                        Значение: {data.weeklyAverages?.energy || 5}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Тревога (1-10)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[data.weeklyAverages?.anxiety || 5]}
                        onValueChange={(value) => handleWeeklyAverageChange('anxiety', value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">
                        Значение: {data.weeklyAverages?.anxiety || 5}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Удовлетворенность жизнью (1-10)</Label>
                    <div className="mt-2 space-y-2">
                      <Slider
                        value={[data.weeklyAverages?.satisfaction || 5]}
                        onValueChange={(value) => handleWeeklyAverageChange('satisfaction', value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-gray-600">
                        Значение: {data.weeklyAverages?.satisfaction || 5}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Самые эффективные активности этой недели</Label>
                  <Textarea
                    value={data.effectiveActivities || ''}
                    onChange={(e) => onDataChange('effectiveActivities', e.target.value)}
                    placeholder="Что помогало лучше всего..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Техники, которые реально помогли</Label>
                  <Textarea
                    value={data.helpfulTechniques || ''}
                    onChange={(e) => onDataChange('helpfulTechniques', e.target.value)}
                    placeholder="Полезные техники и методы..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Люди, которые поддержали</Label>
                  <Textarea
                    value={data.supportivePeople || ''}
                    onChange={(e) => onDataChange('supportivePeople', e.target.value)}
                    placeholder="Кто оказал поддержку..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Основные триггеры плохого настроения</Label>
                  <Textarea
                    value={data.majorTriggers || ''}
                    onChange={(e) => onDataChange('majorTriggers', e.target.value)}
                    placeholder="Что ухудшало состояние..."
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Паттерны избегающего поведения</Label>
                <Textarea
                  value={data.avoidancePatterns || ''}
                  onChange={(e) => onDataChange('avoidancePatterns', e.target.value)}
                  placeholder="Какие паттерны избегания заметили..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Что хочу изменить на следующей неделе</Label>
                <Textarea
                  value={data.nextWeekChanges || ''}
                  onChange={(e) => onDataChange('nextWeekChanges', e.target.value)}
                  placeholder="Планы и намерения..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Месячный обзор прогресса */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900 text-lg">
                📊 Месячный обзор прогресса
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-purple-800 mb-4">Общая динамика месяца</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Общее состояние</Label>
                    <Input
                      value={data.monthlyProgress?.overallState || ''}
                      onChange={(e) => handleMonthlyProgressChange('overallState', e.target.value)}
                      placeholder="Лучше/так же/хуже..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Способность справляться</Label>
                    <Input
                      value={data.monthlyProgress?.copingAbility || ''}
                      onChange={(e) => handleMonthlyProgressChange('copingAbility', e.target.value)}
                      placeholder="Лучше/так же/хуже..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Качество жизни</Label>
                    <Input
                      value={data.monthlyProgress?.lifeQuality || ''}
                      onChange={(e) => handleMonthlyProgressChange('lifeQuality', e.target.value)}
                      placeholder="Лучше/так же/хуже..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-medium">Три главных достижения месяца</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addAchievement}
                  >
                    Добавить
                  </Button>
                </div>
                {(data.monthlyAchievements || []).map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      placeholder={`Достижение ${index + 1}...`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Мои личные триггеры депрессии</Label>
                  <Textarea
                    value={data.personalTriggers || ''}
                    onChange={(e) => onDataChange('personalTriggers', e.target.value)}
                    placeholder="Что узнали о своих триггерах..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Что мне действительно помогает</Label>
                  <Textarea
                    value={data.whatHelps || ''}
                    onChange={(e) => onDataChange('whatHelps', e.target.value)}
                    placeholder="Эффективные способы поддержки..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Мои сильные стороны</Label>
                  <Textarea
                    value={data.strengths || ''}
                    onChange={(e) => onDataChange('strengths', e.target.value)}
                    placeholder="Что проявилось как сила..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Области, где еще нужна поддержка</Label>
                  <Textarea
                    value={data.supportAreas || ''}
                    onChange={(e) => onDataChange('supportAreas', e.target.value)}
                    placeholder="В чем нужна дополнительная помощь..."
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Планы на будущее */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900 text-lg flex items-center">
                <Target className="w-5 h-5 mr-2" />
                🌱 Планы на следующий месяц
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-800 mb-4">Хочу попробовать</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Новую технику работы с состоянием</Label>
                    <Input
                      value={data.futureGoals?.newTechnique || ''}
                      onChange={(e) => handleFutureGoalChange('newTechnique', e.target.value)}
                      placeholder="Какую технику..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Новую приятную активность</Label>
                    <Input
                      value={data.futureGoals?.newActivity || ''}
                      onChange={(e) => handleFutureGoalChange('newActivity', e.target.value)}
                      placeholder="Какую активность..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Новый способ заботы о потребности</Label>
                    <Input
                      value={data.futureGoals?.newCare || ''}
                      onChange={(e) => handleFutureGoalChange('newCare', e.target.value)}
                      placeholder="Какой способ заботы..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-green-800 mb-4">Хочу укрепить</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Привычку</Label>
                    <Input
                      value={data.futureGoals?.strengthenHabit || ''}
                      onChange={(e) => handleFutureGoalChange('strengthenHabit', e.target.value)}
                      placeholder="Какую привычку..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Отношения с</Label>
                    <Input
                      value={data.futureGoals?.strengthenRelation || ''}
                      onChange={(e) => handleFutureGoalChange('strengthenRelation', e.target.value)}
                      placeholder="С кем..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Навык</Label>
                    <Input
                      value={data.futureGoals?.strengthenSkill || ''}
                      onChange={(e) => handleFutureGoalChange('strengthenSkill', e.target.value)}
                      placeholder="Какой навык..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Письмо себе в будущее */}
          <Card className="border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="text-pink-900 text-lg flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                💌 Письмо себе в будущее
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-pink-700 mb-4">
                Каждый месяц — маленькое письмо себе, которое прочитаешь через месяц.
              </p>
              
              <div>
                <Label>Письмо дорогому/ой себе через месяц</Label>
                <Textarea
                  value={data.letterToFuture || ''}
                  onChange={(e) => onDataChange('letterToFuture', e.target.value)}
                  placeholder="Дорогой/ая я через месяц! Сейчас я чувствую... Больше всего меня поддерживает... Я горжусь собой за... Мой совет тебе... Я верю, что через месяц... С любовью и надеждой, Я сегодняшний/яя"
                  className="mt-2 min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Завершение */}
          <div className="text-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto border-2 border-green-200 dark:border-green-700">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center justify-center">
                <Check className="w-6 h-6 mr-2" />
                🌈 Поздравляем!
              </h3>
              <p className="text-gray-700 mb-6">
                Вы завершили дневник заботливого выхода из депрессии. 
                Каждый шаг — это движение к лучшему самочувствию. 
                Вы достойны любви, заботы и счастья!
              </p>
              <Button 
                onClick={onComplete} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Завершить дневник
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>
      </div>
    </div>
  );
};

export default Step8LongTermObservation;
