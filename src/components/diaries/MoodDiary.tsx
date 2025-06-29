import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Heart, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import EmotionSelector from './EmotionSelector';
import { getMoodEmoji, getMoodZone, getRecommendations, emotionsData } from './moodDiaryUtils';

interface MoodDiaryData {
  mood: number;
  moodComment: string;
  selectedEmotions: Array<{
    name: string;
    intensity: number;
  }>;
  emotionTrigger?: string;
  emotionComment: string;
  bodyStateInfluence?: string;
  relatedThoughts?: string;
  triggerSource?: string;
  triggerThought?: string;
  hasCognitiveBias: boolean;
  reframedThought?: string;
  positiveSource?: string;
  selfEvaluation: number;
  gratitude: string;
  emotionConnection?: string;
  emotionImpact?: string;
}

const MoodDiary = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [moodValue, setMoodValue] = useState([0]);
  const [selectedEmotions, setSelectedEmotions] = useState<Array<{name: string; intensity: number}>>([]);
  const [showNegativeQuestions, setShowNegativeQuestions] = useState(false);
  const [showPositiveQuestions, setShowPositiveQuestions] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const form = useForm<MoodDiaryData>({
    defaultValues: {
      mood: 0,
      moodComment: '',
      selectedEmotions: [],
      emotionComment: '',
      relatedThoughts: '',
      hasCognitiveBias: false,
      selfEvaluation: 0,
      gratitude: '',
      emotionConnection: '',
      emotionImpact: ''
    }
  });

  const currentMood = moodValue[0];
  const moodEmoji = getMoodEmoji(currentMood);
  const moodZone = getMoodZone(currentMood);

  // Эмодзи для сфер жизни
  const lifeSpheres = [
    { emoji: '💼', label: 'Работа/учеба', value: 'work' },
    { emoji: '👨‍👩‍👧‍👦', label: 'Семья', value: 'family' },
    { emoji: '❤️', label: 'Отношения', value: 'relationships' },
    { emoji: '🏥', label: 'Здоровье', value: 'health' },
    { emoji: '💰', label: 'Финансы', value: 'money' },
    { emoji: '👥', label: 'Друзья', value: 'friends' },
    { emoji: '🎯', label: 'Цели', value: 'goals' },
    { emoji: '🏠', label: 'Дом/быт', value: 'home' },
    { emoji: '🎨', label: 'Творчество', value: 'creativity' },
    { emoji: '⚡', label: 'Энергия/состояние', value: 'energy' },
    { emoji: '🌍', label: 'Внешние события', value: 'external' },
    { emoji: '🧠', label: 'Мысли', value: 'thoughts' }
  ];

  // Эмодзи для состояний тела
  const bodyStates = [
    { emoji: '😴', label: 'Усталость', value: 'tired', type: 'negative' },
    { emoji: '😰', label: 'Напряжение', value: 'tense', type: 'negative' },
    { emoji: '🤕', label: 'Боль/дискомфорт', value: 'pain', type: 'negative' },
    { emoji: '😵‍💫', label: 'Головокружение', value: 'dizzy', type: 'negative' },
    { emoji: '🫨', label: 'Тревожность в теле', value: 'anxious_body', type: 'negative' },
    { emoji: '😶', label: 'Онемение', value: 'numb', type: 'neutral' },
    { emoji: '😐', label: 'Обычное состояние', value: 'normal', type: 'neutral' },
    { emoji: '🙂', label: 'Спокойствие', value: 'calm', type: 'neutral' },
    { emoji: '💪', label: 'Энергичность', value: 'energetic', type: 'positive' },
    { emoji: '😌', label: 'Расслабленность', value: 'relaxed', type: 'positive' },
    { emoji: '✨', label: 'Легкость', value: 'light', type: 'positive' },
    { emoji: '🔥', label: 'Жизненная сила', value: 'vital', type: 'positive' }
  ];

  useEffect(() => {
    // Проверяем нужны ли уточняющие вопросы
    const hasHighNegativeEmotions = selectedEmotions.some(emotion => {
      const emotionData = emotionsData.negative.find(e => e.name === emotion.name);
      return emotionData && emotion.intensity >= 7;
    });

    const hasHighPositiveEmotions = selectedEmotions.some(emotion => {
      const emotionData = emotionsData.positive.find(e => e.name === emotion.name);
      return emotionData && emotion.intensity >= 8;
    });

    setShowNegativeQuestions(hasHighNegativeEmotions);
    setShowPositiveQuestions(hasHighPositiveEmotions);
  }, [selectedEmotions]);

  const handleMoodChange = (value: number[]) => {
    setMoodValue(value);
    form.setValue('mood', value[0]);
  };

  const handleEmotionSelect = (emotions: Array<{name: string; intensity: number}>) => {
    setSelectedEmotions(emotions);
    form.setValue('selectedEmotions', emotions);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: MoodDiaryData) => {
    // Генерируем рекомендации на основе данных
    const generatedRecommendations = getRecommendations(data);
    setRecommendations(generatedRecommendations);
    
    console.log('Diary entry saved:', data);
    // Здесь будет сохранение в базу данных
  };

  const renderMoodBlock = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">
          Пожалуйста, прислушайся к себе и оцени, какое у тебя сейчас настроение
        </h3>
        
        <div className="flex justify-center mb-6">
          <div className="text-6xl">
            {moodEmoji}
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mb-4">
          <Slider
            value={moodValue}
            onValueChange={handleMoodChange}
            min={-5}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>😞 -5</span>
            <span>😐 0</span>
            <span>🤩 +5</span>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${moodZone.color}`}>
          <p className="text-sm font-medium">{moodZone.description}</p>
          <p className="text-lg font-bold">Настроение: {currentMood}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="moodComment">
          Можешь коротко описать, что особенно влияет на твое настроение сейчас?
        </Label>
        <Input
          id="moodComment"
          placeholder="Опиши свои мысли..."
          {...form.register('moodComment')}
        />
      </div>
    </div>
  );

  const renderEmotionsBlock = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">
        Попробуй теперь описать, какие эмоции и чувства преобладали сегодня?
      </h3>
      
      <EmotionSelector
        currentMood={currentMood}
        onEmotionsChange={handleEmotionSelect}
        selectedEmotions={selectedEmotions}
      />
    </div>
  );

  const renderClarifyingQuestions = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">Уточняющие вопросы</h3>
      
      {/* Основные вопросы - всегда показываем если есть выбранные эмоции */}
      {selectedEmotions.length > 0 && (
        <>
          {/* Вопрос: С чем связанно это чувство? */}
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">С чем связанно это чувство?</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {lifeSpheres.map((sphere) => (
                <button
                  key={sphere.value}
                  type="button"
                  onClick={() => form.setValue('emotionConnection', sphere.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                    form.watch('emotionConnection') === sphere.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{sphere.emoji}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{sphere.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Вопрос: На что влияет эта эмоция? */}
          <div className="space-y-2">
            <Label>На что влияет эта эмоция? Чему мешает или помогает?</Label>
            <Textarea
              placeholder="Опиши, как эмоция влияет на твою жизнь, деятельность, отношения..."
              {...form.register('emotionImpact')}
              rows={3}
            />
          </div>

          {/* Вопрос о влиянии на состояние тела */}
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Как это влияло на твое состояние тела?</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {bodyStates.map((state) => (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => form.setValue('bodyStateInfluence', state.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                    form.watch('bodyStateInfluence') === state.value
                      ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/30'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{state.emoji}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{state.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Вопрос о связанных мыслях */}
          <div className="space-y-2">
            <Label>Какие мысли с этим связаны?</Label>
            <Textarea
              placeholder="Опиши свои мысли и размышления..."
              {...form.register('relatedThoughts')}
              rows={3}
            />
          </div>

          {/* Перенесенный вопрос из шага 2 */}
          <div className="space-y-2">
            <Label>Если хочется, опиши, как это проявлялось или что этому способствовало:</Label>
            <Input
              placeholder="Дополнительные комментарии об эмоциях..."
              {...form.register('emotionComment')}
            />
          </div>
        </>
      )}
      
      {/* Углубленные вопросы для сильных негативных эмоций */}
      {showNegativeQuestions && (
        <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h4 className="font-medium text-orange-900 dark:text-orange-100">Работа с негативными эмоциями</h4>
          
          <div className="space-y-2">
            <Label>Что именно вызвало это чувство?</Label>
            <select 
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              {...form.register('triggerSource')}
            >
              <option value="">Выберите источник</option>
              <option value="external">Внешнее событие</option>
              <option value="thoughts">Внутренние мысли</option>
              <option value="communication">Общение</option>
              <option value="physical">Физиологические причины</option>
              <option value="self-esteem">Самооценка</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Какая мысль или фраза приходила тебе в голову в этот момент?</Label>
            <Input
              placeholder="Опиши свои мысли..."
              {...form.register('triggerThought')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cognitiveBias"
              {...form.register('hasCognitiveBias')}
            />
            <Label htmlFor="cognitiveBias">
              Были ли среди этих мыслей категоричные («я всегда», «я не могу», «у меня не получится»)?
            </Label>
          </div>

          {form.watch('hasCognitiveBias') && (
            <div className="space-y-2">
              <Label>Можешь переформулировать эту мысль так, чтобы она звучала мягче и поддерживающе для тебя?</Label>
              <Input
                placeholder="Переформулированная мысль..."
                {...form.register('reframedThought')}
              />
            </div>
          )}
        </div>
      )}

      {/* Вопросы для сильных позитивных эмоций */}
      {showPositiveQuestions && (
        <div className="space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100">Позитивные моменты</h4>
          
          <div className="space-y-2">
            <Label>Что способствовало этому прекрасному состоянию?</Label>
            <Input
              placeholder="Опиши событие, процесс, поддержку, достижение..."
              {...form.register('positiveSource')}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderSelfEvaluation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Самооценка дня и поддержка</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Если оглянуться на прошедший день, насколько тебе удалось справляться с эмоциями?</Label>
          <div className="mt-2">
            <Slider
              value={[form.watch('selfEvaluation') || 0]}
              onValueChange={(value) => form.setValue('selfEvaluation', value[0])}
              min={-5}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Совсем не справлялся -5</span>
              <span>Отлично справлялся +5</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Что тебе помогло или кого ты хочешь поблагодарить?</Label>
          <Input
            placeholder="Благодарность и поддержка..."
            {...form.register('gratitude')}
          />
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Рекомендации для тебя</h3>
      
      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-800">{recommendation}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Заполните дневник, чтобы получить персональные рекомендации</p>
        </div>
      )}

      <Button 
        onClick={() => form.handleSubmit(onSubmit)()} 
        className="w-full"
        size="lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Сохранить запись в дневник
      </Button>
    </div>
  );

  const steps = [
    { number: 1, title: 'Настроение', content: renderMoodBlock },
    { number: 2, title: 'Эмоции', content: renderEmotionsBlock },
    { number: 3, title: 'Уточнения', content: renderClarifyingQuestions },
    { number: 4, title: 'Самооценка', content: renderSelfEvaluation },
    { number: 5, title: 'Рекомендации', content: renderRecommendations },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <span>Дневник настроения и эмоций</span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Шаг {currentStep} из {steps.length}: {steps[currentStep - 1].title}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {steps[currentStep - 1].content()}
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                
                {currentStep < steps.length && (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodDiary;
