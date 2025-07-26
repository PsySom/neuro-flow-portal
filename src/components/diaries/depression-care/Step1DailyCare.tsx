
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sunrise, Sun, Moon } from 'lucide-react';
import { DepressionCareDiaryData } from './types';

interface Step1DailyCareProps {
  data: DepressionCareDiaryData;
  onDataChange: (field: string, value: any) => void;
  onNext: () => void;
}

const Step1DailyCare: React.FC<Step1DailyCareProps> = ({ data, onDataChange, onNext }) => {
  const bodyStateOptions = [
    'Легкость и энергия', 'Приятная расслабленность', 'Обычное состояние',
    'Усталость, но терпимая', 'Тяжесть в теле', 'Напряжение или боль'
  ];

  const bodyNeedsOptions = [
    'Мягкое движение', 'Больше отдыха', 'Питание', 'Тепло',
    'Свежий воздух', 'Тишина', 'Объятия', 'Не знаю, и это нормально'
  ];

  const dailyIntentionsOptions = [
    'Регулярное питание (3 приема пищи)',
    'Хотя бы 10 минут движения (прогулка, зарядка, танцы)',
    'Время на свежем воздухе',
    'Общение с близким человеком',
    'Что-то приятное для души',
    'Достаточный отдых'
  ];

  const emotionalWeatherOptions = [
    'Солнечно и ясно', 'Переменная облачность', 'Легкая дымка',
    'Пасмурно, но спокойно', 'Моросящий дождик', 'Гроза, но она пройдет',
    'Туман, плохо видно', 'Штиль, все затихло'
  ];

  const activityFeelingOptions = [
    'Приятно и легко', 'Нормально, обычно', 'Немного напрягало',
    'Сложно, но справляюсь', 'Очень тяжело'
  ];

  const avoidanceBehaviorsOptions = [
    'Зависание в телефоне/соцсетях дольше обычного',
    'Переедание или, наоборот, забывание поесть',
    'Откладывание дел, которые планировал/а',
    'Жалобы и переживания в разговорах с близкими',
    'Желание спрятаться и ни с кем не общаться',
    'Прокрастинацию — делаю что угодно, только не важное'
  ];

  const basicNeedsOptions = [
    'Завтрак', 'Обед', 'Ужин',
    'Достаточно воды (не заставляя себя)',
    'Хотя бы немного движения',
    'Свежий воздух (даже просто открытое окно)',
    'Общение с живым человеком',
    'Время для отдыха'
  ];

  const sleepPreparationOptions = [
    'Проветрить комнату', 'Убрать телефон за час до сна',
    'Принять теплый душ/ванну', 'Почитать что-то легкое',
    'Сделать несколько глубоких вдохов', 'Включить спокойную музыку',
    'Записать мысли, чтобы не крутились в голове'
  ];

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const currentValues = data[field as keyof DepressionCareDiaryData] as string[] || [];
    if (checked) {
      onDataChange(field, [...currentValues, value]);
    } else {
      onDataChange(field, currentValues.filter(item => item !== value));
    }
  };

  const handleMoodWordsChange = (index: number, value: string) => {
    const newWords = [...(data.moodWords || ['', '', ''])];
    newWords[index] = value;
    onDataChange('moodWords', newWords);
  };

  const handleSmallJoysChange = (index: number, value: string) => {
    const newJoys = [...(data.smallJoys || ['', '', ''])];
    newJoys[index] = value;
    onDataChange('smallJoys', newJoys);
  };

  return (
    <div className="space-y-8">
      {/* Утреннее пробуждение */}
      <Card className="border-pink-200 bg-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-pink-800">
            <Sunrise className="w-6 h-6" />
            <span>🌅 Утреннее пробуждение к жизни</span>
          </CardTitle>
          <p className="text-sm text-pink-700">
            Как ты встречаешь новый день? Каждое утро — это новая возможность позаботиться о себе.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Качество отдыха */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Качество отдыха и восстановления</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedtime">Во сколько удалось заснуть вчера</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={data.bedtime}
                  onChange={(e) => onDataChange('bedtime', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="wakeupTime">Во сколько проснулся/лась естественно</Label>
                <Input
                  id="wakeupTime"
                  type="time"
                  value={data.wakeupTime}
                  onChange={(e) => onDataChange('wakeupTime', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nightWakeups">Сколько раз просыпался/лась ночью</Label>
              <Input
                id="nightWakeups"
                type="number"
                min="0"
                value={data.nightWakeups}
                onChange={(e) => onDataChange('nightWakeups', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label>Как оцениваешь качество сна (1-очень плохо, 10-отлично): {data.sleepQuality}</Label>
              <Slider
                value={[data.sleepQuality]}
                onValueChange={(value) => onDataChange('sleepQuality', value[0])}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Чувствуешь ли себя отдохнувшим/ей (1-совсем нет, 10-полностью): {data.restedness}</Label>
              <Slider
                value={[data.restedness]}
                onValueChange={(value) => onDataChange('restedness', value[0])}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <p className="text-sm text-gray-600 italic">
              Если сон был беспокойным, это нормально. Сегодня новый день, и ты можешь позаботиться о лучшем отдыхе tonight.
            </p>
          </div>

          {/* Встреча с собой утром */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Встреча с собой утром</h4>
            
            <div>
              <Label>Какое настроение сейчас ощущаешь? (-10 до +10): {data.morningMood}</Label>
              <Slider
                value={[data.morningMood]}
                onValueChange={(value) => onDataChange('morningMood', value[0])}
                max={10}
                min={-10}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Тремя словами опиши свое состояние:</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={index}
                    placeholder={`Слово ${index + 1}`}
                    value={data.moodWords[index] || ''}
                    onChange={(e) => handleMoodWordsChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Как чувствует себя твое тело?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {bodyStateOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`bodyState-${option}`}
                      checked={data.bodyState.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('bodyState', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`bodyState-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Что сейчас нужно твоему телу?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {bodyNeedsOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`bodyNeeds-${option}`}
                      checked={data.bodyNeeds.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('bodyNeeds', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`bodyNeeds-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Намерения на день */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Намерения на день</h4>
            <p className="text-sm text-gray-600">Не планы и обязательства, а мягкие намерения заботы о себе.</p>
            
            <div>
              <Label>Сегодня я хотел/а бы позаботиться о себе через:</Label>
              <div className="space-y-2 mt-2">
                {dailyIntentionsOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`intentions-${option}`}
                      checked={data.dailyIntentions.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('dailyIntentions', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`intentions-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="dailyJoy">Одна маленькая радость, которую подарю себе сегодня:</Label>
              <Textarea
                id="dailyJoy"
                value={data.dailyJoy}
                onChange={(e) => onDataChange('dailyJoy', e.target.value)}
                placeholder="Опиши что-то приятное, что ты можешь сделать для себя сегодня..."
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Дневной чекин */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <Sun className="w-6 h-6" />
            <span>🌞 Дневной чекин: как дела у моей души?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div>
              <Label htmlFor="middayTime">Время:</Label>
              <Input
                id="middayTime"
                type="time"
                value={data.middayTime}
                onChange={(e) => onDataChange('middayTime', e.target.value)}
                className="w-32"
              />
            </div>

            <div>
              <Label>Какое настроение (-10 до +10): {data.middayMood}</Label>
              <Slider
                value={[data.middayMood]}
                onValueChange={(value) => onDataChange('middayMood', value[0])}
                max={10}
                min={-10}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Эмоциональная погода сейчас</Label>
              <p className="text-sm text-gray-600 mb-2">
                Если на улице дождь, это не значит, что погода плохая — просто такая погода. 
                Что сейчас "погода" в твоей душе?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {emotionalWeatherOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`weather-${option}`}
                      name="emotionalWeather"
                      value={option}
                      checked={data.emotionalWeather === option}
                      onChange={(e) => onDataChange('emotionalWeather', e.target.value)}
                    />
                    <Label htmlFor={`weather-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="currentActivity">Чем занимаешься/занимался последние 2 часа:</Label>
              <Textarea
                id="currentActivity"
                value={data.currentActivity}
                onChange={(e) => onDataChange('currentActivity', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Это было:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {activityFeelingOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`feeling-${option}`}
                      name="activityFeeling"
                      value={option}
                      checked={data.activityFeeling === option}
                      onChange={(e) => onDataChange('activityFeeling', e.target.value)}
                    />
                    <Label htmlFor={`feeling-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Проверка избегающего поведения */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Небольшая проверка избегающего поведения</h4>
            <p className="text-sm text-gray-600">Без самокритики, просто замечаем. Иногда избегание — это способ защиты.</p>
            
            <div>
              <Label>Замечаю ли я сегодня за собой:</Label>
              <div className="space-y-2 mt-2">
                {avoidanceBehaviorsOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`avoidance-${option}`}
                      checked={data.avoidanceBehaviors.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('avoidanceBehaviors', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`avoidance-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="selfCareAction">
                Если что-то отметил/а — это сигнал, что нужна поддержка. 
                Одно маленькое действие заботы о себе, которое могу сделать прямо сейчас:
              </Label>
              <Textarea
                id="selfCareAction"
                value={data.selfCareAction}
                onChange={(e) => onDataChange('selfCareAction', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Вечернее подведение итогов */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Moon className="w-6 h-6" />
            <span>🌙 Вечернее подведение итогов</span>
          </CardTitle>
          <p className="text-sm text-indigo-700">
            Время суток, когда можно с добротой взглянуть на прожитый день.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Как прошел день в целом</h4>
            
            <div>
              <Label>Общее ощущение от дня (-10 до +10): {data.overallDayRating}</Label>
              <Slider
                value={[data.overallDayRating]}
                onValueChange={(value) => onDataChange('overallDayRating', value[0])}
                max={10}
                min={-10}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="mostDifficult">Самое сложное сегодня было:</Label>
              <Textarea
                id="mostDifficult"
                value={data.mostDifficult}
                onChange={(e) => onDataChange('mostDifficult', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="mostPleasant">Самое приятное или хотя бы нейтральное:</Label>
              <Textarea
                id="mostPleasant"
                value={data.mostPleasant}
                onChange={(e) => onDataChange('mostPleasant', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="selfPraise">За что могу себя тихонько похвалить сегодня:</Label>
              <Textarea
                id="selfPraise"
                value={data.selfPraise}
                onChange={(e) => onDataChange('selfPraise', e.target.value)}
                placeholder="Даже если просто встал/а с кровати — это уже подвиг при депрессии."
                className="mt-2"
              />
            </div>
          </div>

          {/* Охота за клубничками */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Охота за "клубничками" — маленькими радостями</h4>
            <p className="text-sm text-gray-600">
              Даже в сложный день есть моменты, которые можно заметить и оценить.
            </p>
            
            <div>
              <Label>3 маленькие приятности сегодня (любые мелочи):</Label>
              <p className="text-xs text-gray-500 mb-2">
                Примеры: теплый чай, мягкий плед, улыбка прохожего, интересная мысль в книге, 
                красивый цвет неба, удобная поза, приятный запах, момент тишины.
              </p>
              <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                  <Input
                    key={index}
                    placeholder={`Приятность ${index + 1}`}
                    value={data.smallJoys[index] || ''}
                    onChange={(e) => handleSmallJoysChange(index, e.target.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Забота о базовых потребностях */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Забота о базовых потребностях</h4>
            
            <div>
              <Label>Сегодня у меня было:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {basicNeedsOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`basicNeeds-${option}`}
                      checked={data.basicNeedsCovered.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('basicNeedsCovered', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`basicNeeds-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2 italic">
                Каждая галочка — это акт заботы о себе. Если что-то не получилось — завтра новый день.
              </p>
            </div>
          </div>

          {/* Подготовка к отдыху */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Подготовка к отдыху</h4>
            
            <div>
              <Label>Что поможет лучше отдохнуть сегодня ночью:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {sleepPreparationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sleepPrep-${option}`}
                      checked={data.sleepPreparation.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('sleepPreparation', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`sleepPrep-${option}`} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="plannedBedtime">Планируемое время отхода ко сну:</Label>
              <Input
                id="plannedBedtime"
                type="time"
                value={data.plannedBedtime}
                onChange={(e) => onDataChange('plannedBedtime', e.target.value)}
                className="w-32 mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-pink-600 hover:bg-pink-700">
          Далее: Эмоциональное состояние
        </Button>
      </div>
    </div>
  );
};

export default Step1DailyCare;
