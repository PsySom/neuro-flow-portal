
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Brain, Save, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

interface ThoughtsDiaryData {
  hasDisturbingThought: boolean;
  thoughtText: string;
  trigger: string;
  triggerOther?: string;
  categories: string[];
  categoryOther?: string;
  cognitiveDistortions: string[];
  distortionOther?: string;
  abcAnalysis: {
    activatingEvent: string;
    belief: string;
    consequence: string;
  };
  emotions: string[];
  emotionOther?: string;
  reactions: string[];
  reactionOther?: string;
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeThought: string;
  selfCompassion: string;
  supportivePhrase: string;
  alternativeActions: string[];
  actionOther?: string;
  copingStrategies: string[];
  copingOther?: string;
  currentFeeling: string;
  selfCareAction?: string;
}

const ThoughtsDiary = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);

  const form = useForm<ThoughtsDiaryData>({
    defaultValues: {
      hasDisturbingThought: false,
      thoughtText: '',
      trigger: '',
      categories: [],
      cognitiveDistortions: [],
      abcAnalysis: {
        activatingEvent: '',
        belief: '',
        consequence: ''
      },
      emotions: [],
      reactions: [],
      evidenceFor: '',
      evidenceAgainst: '',
      alternativeThought: '',
      selfCompassion: '',
      supportivePhrase: '',
      alternativeActions: [],
      copingStrategies: [],
      currentFeeling: ''
    }
  });

  const triggers = [
    { value: 'situation', label: 'Ситуация, событие' },
    { value: 'words', label: 'Чьи-то слова' },
    { value: 'memory', label: 'Воспоминание' },
    { value: 'future', label: 'Ожидание или тревога о будущем' },
    { value: 'other', label: 'Другое' }
  ];

  const categories = [
    { value: 'self', label: 'Себя (самооценка, вина, стыд, неуверенность)' },
    { value: 'relationships', label: 'Отношения (страх оценки, конфликт, доверие)' },
    { value: 'world', label: 'Мир (опасность, справедливость, доверие к миру)' },
    { value: 'future', label: 'Будущее (катастрофизация, тревога, неуверенность)' },
    { value: 'past', label: 'Прошлое (самокритика, сожаления)' },
    { value: 'health', label: 'Тело, здоровье' },
    { value: 'work', label: 'Деньги, работа, успех' },
    { value: 'other', label: 'Другое' }
  ];

  const cognitiveDistortions = [
    { value: 'catastrophizing', label: 'Катастрофизация' },
    { value: 'blackwhite', label: 'Чёрно-белое мышление' },
    { value: 'personalization', label: 'Персонализация' },
    { value: 'devaluation', label: 'Обесценивание' },
    { value: 'mindreading', label: 'Чтение мыслей' },
    { value: 'fortunetelling', label: 'Предсказание будущего' },
    { value: 'generalization', label: 'Генерализация' },
    { value: 'shouldstatements', label: 'Долженствование' },
    { value: 'mentalfilter', label: 'Фильтрация негатива' },
    { value: 'emotionalreasoning', label: 'Эмоциональное рассуждение: "Если я это чувствую, значит это правда"' },
    { value: 'other', label: 'Другое' }
  ];

  const emotions = [
    { value: 'anxiety', label: 'Тревога' },
    { value: 'fear', label: 'Страх' },
    { value: 'shame', label: 'Стыд' },
    { value: 'guilt', label: 'Вина' },
    { value: 'sadness', label: 'Грусть' },
    { value: 'anger', label: 'Злость' },
    { value: 'irritation', label: 'Раздражение' },
    { value: 'hopelessness', label: 'Безысходность' },
    { value: 'resentment', label: 'Обида' },
    { value: 'other', label: 'Другое' }
  ];

  const reactions = [
    { value: 'avoid', label: 'Избегаю' },
    { value: 'selfcriticism', label: 'Критикую себя' },
    { value: 'procrastinate', label: 'Прокрастинирую' },
    { value: 'losemotivation', label: 'Теряю мотивацию' },
    { value: 'conflict', label: 'Конфликтую' },
    { value: 'control', label: 'Стараюсь всё контролировать' },
    { value: 'withdraw', label: 'Закрываюсь' },
    { value: 'other', label: 'Другое' }
  ];

  const alternativeActions = [
    { value: 'pause', label: 'Сделать паузу и подышать' },
    { value: 'talk', label: 'Поговорить с близким человеком' },
    { value: 'write', label: 'Написать письмо поддержки себе' },
    { value: 'plan', label: 'Составить план маленьких шагов' },
    { value: 'selfcare', label: 'Заняться заботой о себе' },
    { value: 'exercise', label: 'Сделать физическое упражнение' },
    { value: 'mindfulness', label: 'Практика осознанности' },
    { value: 'other', label: 'Другое' }
  ];

  const copingStrategies = [
    { value: 'smer', label: 'Практика СМЭР' },
    { value: 'abc', label: 'АБС-анализ' },
    { value: 'reframing', label: 'Рефрейминг' },
    { value: 'breathing', label: 'Дыхание 4-7-8' },
    { value: 'copingcard', label: 'Копинг-карточка с фразами поддержки' },
    { value: 'mindfulness', label: 'Майндфулнес-пауза' },
    { value: 'future', label: 'Письмо себе из будущего' },
    { value: 'evidence', label: 'Техника "Доказательства и опровержения"' },
    { value: 'other', label: 'Другое' }
  ];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ThoughtsDiaryData) => {
    console.log('Thoughts diary entry saved:', data);
    // Здесь будет сохранение в базу данных
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Осознанность. «Поймать мысль»</h3>
      <div className="space-y-4">
        <Label className="text-base">
          Была ли сегодня мысль, установка или внутренний сценарий, который(-ая) повторялся(-ась), тревожил(-а), мешал(-а) чувствовать себя спокойно или уверенно?
        </Label>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="true"
              checked={form.watch('hasDisturbingThought') === true}
              onChange={() => form.setValue('hasDisturbingThought', true)}
              className="w-4 h-4"
            />
            <span>Да</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="false"
              checked={form.watch('hasDisturbingThought') === false}
              onChange={() => form.setValue('hasDisturbingThought', false)}
              className="w-4 h-4"
            />
            <span>Нет</span>
          </label>
        </div>
        {form.watch('hasDisturbingThought') === false && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">
              Прекрасно! Вы можете вернуться к дневнику, когда появится желание или необходимость.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Фиксация и описание</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Запишите дословно тревожащую или мешающую мысль/убеждение
          </Label>
          <Textarea
            placeholder="Что меня сегодня больше всего задело?"
            {...form.register('thoughtText')}
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Когда эта мысль появилась — что её спровоцировало?</Label>
          <div className="space-y-2">
            {triggers.map((trigger) => (
              <label key={trigger.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={trigger.value}
                  checked={form.watch('trigger') === trigger.value}
                  onChange={() => form.setValue('trigger', trigger.value)}
                  className="w-4 h-4"
                />
                <span>{trigger.label}</span>
              </label>
            ))}
          </div>
          {form.watch('trigger') === 'other' && (
            <Input
              placeholder="Опишите подробнее..."
              {...form.register('triggerOther')}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Категоризация</h3>
      <div className="space-y-4">
        <Label>Эта мысль/убеждение про... (можно выбрать несколько):</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('categories').includes(category.value)}
                onCheckedChange={(checked) => {
                  const current = form.watch('categories');
                  if (checked) {
                    form.setValue('categories', [...current, category.value]);
                  } else {
                    form.setValue('categories', current.filter(c => c !== category.value));
                  }
                }}
              />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
        {form.watch('categories').includes('other') && (
          <Input
            placeholder="Уточните..."
            {...form.register('categoryOther')}
          />
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Определение когнитивных искажений</h3>
      <div className="space-y-4">
        <Label>Найдите в этой мысли/убеждении что-то из когнитивных искажений:</Label>
        <div className="space-y-2">
          {cognitiveDistortions.map((distortion) => (
            <label key={distortion.value} className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch('cognitiveDistortions').includes(distortion.value)}
                onCheckedChange={(checked) => {
                  const current = form.watch('cognitiveDistortions');
                  if (checked) {
                    form.setValue('cognitiveDistortions', [...current, distortion.value]);
                  } else {
                    form.setValue('cognitiveDistortions', current.filter(d => d !== distortion.value));
                  }
                }}
              />
              <span>{distortion.label}</span>
            </label>
          ))}
        </div>
        {form.watch('cognitiveDistortions').includes('other') && (
          <Input
            placeholder="Опишите другое искажение..."
            {...form.register('distortionOther')}
          />
        )}
        
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">АБС-анализ</h4>
          <div className="space-y-3">
            <div>
              <Label>A — Активирующее событие (что произошло?):</Label>
              <Input
                placeholder="Опишите событие..."
                {...form.register('abcAnalysis.activatingEvent')}
              />
            </div>
            <div>
              <Label>B — Вера/убеждение (во что я поверил(а)?):</Label>
              <Input
                placeholder="Ваша мысль/убеждение..."
                {...form.register('abcAnalysis.belief')}
              />
            </div>
            <div>
              <Label>C — Последствие (что я почувствовал(а)? что сделал(а)?):</Label>
              <Input
                placeholder="Эмоции и поведение..."
                {...form.register('abcAnalysis.consequence')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Эмоции и реакция</h3>
      <div className="space-y-4">
        <div>
          <Label>Какие чувства вызывает эта мысль? (можно выбрать несколько)</Label>
          <div className="space-y-2 mt-2">
            {emotions.map((emotion) => (
              <label key={emotion.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('emotions').includes(emotion.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('emotions');
                    if (checked) {
                      form.setValue('emotions', [...current, emotion.value]);
                    } else {
                      form.setValue('emotions', current.filter(e => e !== emotion.value));
                    }
                  }}
                />
                <span>{emotion.label}</span>
              </label>
            ))}
          </div>
          {form.watch('emotions').includes('other') && (
            <Input
              placeholder="Укажите другое чувство..."
              {...form.register('emotionOther')}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label>Как обычно вы реагируете, если верите этой мысли?</Label>
          <div className="space-y-2 mt-2">
            {reactions.map((reaction) => (
              <label key={reaction.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('reactions').includes(reaction.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('reactions');
                    if (checked) {
                      form.setValue('reactions', [...current, reaction.value]);
                    } else {
                      form.setValue('reactions', current.filter(r => r !== reaction.value));
                    }
                  }}
                />
                <span>{reaction.label}</span>
              </label>
            ))}
          </div>
          {form.watch('reactions').includes('other') && (
            <Input
              placeholder="Опишите другую реакцию..."
              {...form.register('reactionOther')}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Оспаривание и формирование альтернатив</h3>
      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 rounded-lg space-y-3">
          <h4 className="font-medium text-yellow-900">Анализ доказательств</h4>
          <div>
            <Label>Какие есть доказательства ЗА эту мысль?</Label>
            <Textarea
              placeholder="Что подтверждает эту мысль?"
              {...form.register('evidenceFor')}
            />
          </div>
          <div>
            <Label>Какие есть доказательства ПРОТИВ этой мысли?</Label>
            <Textarea
              placeholder="Что опровергает эту мысль? Было ли так всегда?"
              {...form.register('evidenceAgainst')}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label>Какой более поддерживающий, заботливый или реалистичный взгляд возможен?</Label>
            <Textarea
              placeholder="Альтернативная мысль..."
              {...form.register('alternativeThought')}
            />
          </div>
          <div>
            <Label>Как вы могли бы проявить сострадание к себе?</Label>
            <Textarea
              placeholder="Что бы вы сказали близкому другу в такой ситуации?"
              {...form.register('selfCompassion')}
            />
          </div>
          <div>
            <Label>Какую фразу могли бы повторять себе в следующий раз?</Label>
            <Input
              placeholder="Например: 'Я не обязан быть идеальным — я стараюсь, и этого достаточно'"
              {...form.register('supportivePhrase')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Альтернативные реакции и сценарии</h3>
      <div className="space-y-4">
        <div>
          <Label>Что вы могли бы сделать иначе, если бы смотрели на ситуацию с поддержкой к себе?</Label>
          <div className="space-y-2 mt-2">
            {alternativeActions.map((action) => (
              <label key={action.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('alternativeActions').includes(action.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('alternativeActions');
                    if (checked) {
                      form.setValue('alternativeActions', [...current, action.value]);
                    } else {
                      form.setValue('alternativeActions', current.filter(a => a !== action.value));
                    }
                  }}
                />
                <span>{action.label}</span>
              </label>
            ))}
          </div>
          {form.watch('alternativeActions').includes('other') && (
            <Input
              placeholder="Опишите другое действие..."
              {...form.register('actionOther')}
              className="mt-2"
            />
          )}
        </div>

        <div>
          <Label>Какие копинг-стратегии или упражнения могут поддержать вас в этот момент?</Label>
          <div className="space-y-2 mt-2">
            {copingStrategies.map((strategy) => (
              <label key={strategy.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={form.watch('copingStrategies').includes(strategy.value)}
                  onCheckedChange={(checked) => {
                    const current = form.watch('copingStrategies');
                    if (checked) {
                      form.setValue('copingStrategies', [...current, strategy.value]);
                    } else {
                      form.setValue('copingStrategies', current.filter(s => s !== strategy.value));
                    }
                  }}
                />
                <span>{strategy.label}</span>
              </label>
            ))}
          </div>
          {form.watch('copingStrategies').includes('other') && (
            <Input
              placeholder="Опишите другую стратегию..."
              {...form.register('copingOther')}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Краткая рефлексия</h3>
      <div className="space-y-4">
        <div>
          <Label>Что вы сейчас чувствуете, когда просмотрели все эти шаги?</Label>
          <Textarea
            placeholder="Опишите ваши ощущения после работы с мыслями..."
            {...form.register('currentFeeling')}
          />
        </div>

        <div>
          <Label>Есть ли желание позаботиться о себе прямо сейчас? Что это может быть?</Label>
          <Input
            placeholder="Например: попить чай, послушать музыку, позвонить другу..."
            {...form.register('selfCareAction')}
          />
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">
            🌟 Вы сделали для себя нечто важное. Это не всегда легко, но с каждым разом становится проще. Спасибо, что заботитесь о себе!
          </p>
        </div>

        <Button 
          onClick={() => form.handleSubmit(onSubmit)()} 
          className="w-full"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить запись в дневник
        </Button>
      </div>
    </div>
  );

  if (!form.watch('hasDisturbingThought') && currentStep === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-indigo-500" />
              <span>Дневник работы с мыслями и когнитивными искажениями</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                {renderStep1()}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Осознанность', content: renderStep1 },
    { number: 2, title: 'Фиксация', content: renderStep2 },
    { number: 3, title: 'Категоризация', content: renderStep3 },
    { number: 4, title: 'Искажения', content: renderStep4 },
    { number: 5, title: 'Эмоции', content: renderStep5 },
    { number: 6, title: 'Альтернативы', content: renderStep6 },
    { number: 7, title: 'Действия', content: renderStep7 },
    { number: 8, title: 'Рефлексия', content: renderStep8 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <span>Дневник работы с мыслями и когнитивными искажениями</span>
          </CardTitle>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
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

export default ThoughtsDiary;
