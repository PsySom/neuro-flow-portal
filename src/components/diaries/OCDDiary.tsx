
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Save, Heart, Lightbulb } from 'lucide-react';

interface OCDEntry {
  hadObsessions: string;
  obsessionNotes: string;
  obsessionDescription: string;
  obsessionThemes: string[];
  obsessionTime: string;
  anxietyLevel: number;
  obsessionTriggers: string;
  hadCompulsions: string;
  compulsionDescription: string;
  compulsionTypes: string[];
  compulsionTime: string;
  anxietyBefore: number;
  anxietyDuring: number;
  anxietyAfter: number;
  resistedCompulsions: string;
  resistanceNotes: string;
  usedObserverPractice: string;
  observedThought: string;
  thoughtLabel: string;
  resistanceTime: string;
  observerEmotions: string;
  usedBreathing: string;
  breathingTime: string;
  breathingAnxietyBefore: number;
  breathingAnxietyAfter: number;
  breathingSensations: string;
  hasRitualsList: string;
  ritualWork: string[];
  ritualProgress: string;
  progressNotes: string;
  supportLetter: string;
  saveSupport: string;
  dayReflectionHard: string;
  dayReflectionGood: string;
  wantDiscuss: string;
  tomorrowSteps: string;
  needHelp: string;
  seekProfessional: string;
}

const OCDDiary: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [entry, setEntry] = useState<OCDEntry>({
    hadObsessions: '',
    obsessionNotes: '',
    obsessionDescription: '',
    obsessionThemes: [],
    obsessionTime: '',
    anxietyLevel: 0,
    obsessionTriggers: '',
    hadCompulsions: '',
    compulsionDescription: '',
    compulsionTypes: [],
    compulsionTime: '',
    anxietyBefore: 0,
    anxietyDuring: 0,
    anxietyAfter: 0,
    resistedCompulsions: '',
    resistanceNotes: '',
    usedObserverPractice: '',
    observedThought: '',
    thoughtLabel: '',
    resistanceTime: '',
    observerEmotions: '',
    usedBreathing: '',
    breathingTime: '',
    breathingAnxietyBefore: 0,
    breathingAnxietyAfter: 0,
    breathingSensations: '',
    hasRitualsList: '',
    ritualWork: [],
    ritualProgress: '',
    progressNotes: '',
    supportLetter: '',
    saveSupport: '',
    dayReflectionHard: '',
    dayReflectionGood: '',
    wantDiscuss: '',
    tomorrowSteps: '',
    needHelp: '',
    seekProfessional: ''
  });

  const { toast } = useToast();

  const steps = [
    { id: 'obsessions', title: 'Навязчивые мысли', required: true },
    { id: 'compulsions', title: 'Ритуалы и компульсии', required: true },
    { id: 'observer', title: 'Практика наблюдателя', required: false },
    { id: 'breathing', title: 'Дыхательные практики', required: false },
    { id: 'rituals', title: 'Работа с ритуалами', required: false },
    { id: 'support', title: 'Поддерживающее письмо', required: false },
    { id: 'reflection', title: 'Рефлексия дня', required: true },
    { id: 'help', title: 'Потребность в помощи', required: false }
  ];

  const handleThemeToggle = (theme: string) => {
    setEntry(prev => ({
      ...prev,
      obsessionThemes: prev.obsessionThemes.includes(theme)
        ? prev.obsessionThemes.filter(t => t !== theme)
        : [...prev.obsessionThemes, theme]
    }));
  };

  const handleCompulsionTypeToggle = (type: string) => {
    setEntry(prev => ({
      ...prev,
      compulsionTypes: prev.compulsionTypes.includes(type)
        ? prev.compulsionTypes.filter(t => t !== type)
        : [...prev.compulsionTypes, type]
    }));
  };

  const handleRitualWorkToggle = (work: string) => {
    setEntry(prev => ({
      ...prev,
      ritualWork: prev.ritualWork.includes(work)
        ? prev.ritualWork.filter(w => w !== work)
        : [...prev.ritualWork, work]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveEntry = () => {
    const savedEntries = JSON.parse(localStorage.getItem('ocdDiaryEntries') || '[]');
    const newEntry = {
      ...entry,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    savedEntries.push(newEntry);
    localStorage.setItem('ocdDiaryEntries', JSON.stringify(savedEntries));
    
    toast({
      title: "Запись сохранена",
      description: "Ваш дневник ОКР сохранён успешно",
    });
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'obsessions':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">1. Были ли у вас сегодня навязчивые мысли (обсессии)?</Label>
              <RadioGroup 
                value={entry.hadObsessions} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, hadObsessions: value }))}
                className="mt-2"
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
            </div>

            <div>
              <Label htmlFor="obsession-notes">Опишите свои ощущения утром/вечером:</Label>
              <Textarea
                id="obsession-notes"
                value={entry.obsessionNotes}
                onChange={(e) => setEntry(prev => ({ ...prev, obsessionNotes: e.target.value }))}
                placeholder="Опишите ваши ощущения..."
                className="mt-2"
              />
            </div>

            {entry.hadObsessions === 'yes' && (
              <>
                <div>
                  <Label htmlFor="obsession-description">1.1. Опишите навязчивые мысли, которые возникали:</Label>
                  <Textarea
                    id="obsession-description"
                    value={entry.obsessionDescription}
                    onChange={(e) => setEntry(prev => ({ ...prev, obsessionDescription: e.target.value }))}
                    placeholder="Опишите навязчивые мысли..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">1.2. Какие из тем наиболее актуальны? (можно выбрать несколько)</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      'Страх загрязнения/заражения',
                      'Сомнения (выключил ли я свет, закрыл ли дверь и т.д.)',
                      'Страх причинить вред себе или другим',
                      'Перфекционизм, симметрия, порядок',
                      'Религиозные или моральные опасения',
                      'Навязчивые числа, повторения'
                    ].map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          id={theme}
                          checked={entry.obsessionThemes.includes(theme)}
                          onCheckedChange={() => handleThemeToggle(theme)}
                        />
                        <Label htmlFor={theme} className="text-sm">{theme}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">1.3. Сколько времени сегодня занимали эти мысли?</Label>
                  <RadioGroup 
                    value={entry.obsessionTime} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, obsessionTime: value }))}
                    className="mt-2"
                  >
                    {[
                      'Менее 10 минут',
                      '10–30 минут',
                      '30–60 минут',
                      '1–2 часа',
                      'Более 2 часов'
                    ].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={time} />
                        <Label htmlFor={time}>{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="anxiety-level">1.4. Какой уровень тревоги вы испытали? (0 — нет тревоги, 10 — максимум)</Label>
                  <Input
                    id="anxiety-level"
                    type="number"
                    min="0"
                    max="10"
                    value={entry.anxietyLevel}
                    onChange={(e) => setEntry(prev => ({ ...prev, anxietyLevel: parseInt(e.target.value) || 0 }))}
                    className="mt-2 w-20"
                  />
                </div>

                <div>
                  <Label htmlFor="obsession-triggers">1.5. В каких ситуациях/местах/состояниях появлялись мысли?</Label>
                  <Textarea
                    id="obsession-triggers"
                    value={entry.obsessionTriggers}
                    onChange={(e) => setEntry(prev => ({ ...prev, obsessionTriggers: e.target.value }))}
                    placeholder="Опишите ситуации..."
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Совет:</strong> Навязчивые мысли не определяют вас как личность. Позвольте им быть, но не торопитесь с выводами и действиями. Иногда достаточно просто наблюдать за мыслью, чтобы она ослабла.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'compulsions':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">2. Выполняли ли вы сегодня ритуалы или компульсивные действия в ответ на эти мысли?</Label>
              <RadioGroup 
                value={entry.hadCompulsions} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, hadCompulsions: value }))}
                className="mt-2"
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

            {entry.hadCompulsions === 'no' && (
              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Совет:</strong> Каждый раз, когда вы удерживаетесь от ритуала — это маленькая победа! Позвольте себе гордиться этим шагом, даже если тревога была сильной.
                </AlertDescription>
              </Alert>
            )}

            {entry.hadCompulsions === 'yes' && (
              <>
                <div>
                  <Label htmlFor="compulsion-description">2.1. Опишите ритуалы/действия:</Label>
                  <Textarea
                    id="compulsion-description"
                    value={entry.compulsionDescription}
                    onChange={(e) => setEntry(prev => ({ ...prev, compulsionDescription: e.target.value }))}
                    placeholder="Опишите ритуалы..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">2.2. Какие именно ритуалы были сегодня?</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      'Мытьё рук, принятие душа',
                      'Проверка дверей, окон, электроприборов',
                      'Счёт, повторения, проговаривание слов',
                      'Раскладка предметов по порядку/симметрии',
                      'Переспрашивание, просьбы об уверении',
                      'Избегание определённых мест/предметов'
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={entry.compulsionTypes.includes(type)}
                          onCheckedChange={() => handleCompulsionTypeToggle(type)}
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">2.3. Сколько времени заняли ритуалы?</Label>
                  <RadioGroup 
                    value={entry.compulsionTime} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, compulsionTime: value }))}
                    className="mt-2"
                  >
                    {[
                      'Менее 10 минут',
                      '10–30 минут',
                      '30–60 минут',
                      '1–2 часа',
                      'Более 2 часов'
                    ].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={`comp-${time}`} />
                        <Label htmlFor={`comp-${time}`}>{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">2.4. Оцените уровень тревоги:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="anxiety-before">До ритуала (0-10):</Label>
                      <Input
                        id="anxiety-before"
                        type="number"
                        min="0"
                        max="10"
                        value={entry.anxietyBefore}
                        onChange={(e) => setEntry(prev => ({ ...prev, anxietyBefore: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="anxiety-during">Во время (0-10):</Label>
                      <Input
                        id="anxiety-during"
                        type="number"
                        min="0"
                        max="10"
                        value={entry.anxietyDuring}
                        onChange={(e) => setEntry(prev => ({ ...prev, anxietyDuring: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="anxiety-after">После (0-10):</Label>
                      <Input
                        id="anxiety-after"
                        type="number"
                        min="0"
                        max="10"
                        value={entry.anxietyAfter}
                        onChange={(e) => setEntry(prev => ({ ...prev, anxietyAfter: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">2.5. Удалось ли вам сопротивляться ритуалу?</Label>
                  <RadioGroup 
                    value={entry.resistedCompulsions} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, resistedCompulsions: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fully" id="resist-fully" />
                      <Label htmlFor="resist-fully">Да, полностью</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partially" id="resist-partially" />
                      <Label htmlFor="resist-partially">Да, частично</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="resist-no" />
                      <Label htmlFor="resist-no">Нет, не смог(ла)</Label>
                    </div>
                  </RadioGroup>

                  {(entry.resistedCompulsions === 'partially' || entry.resistedCompulsions === 'no') && (
                    <div className="mt-4">
                      <Label htmlFor="resistance-notes">
                        {entry.resistedCompulsions === 'partially' ? 'Опишите, что помогло сопротивляться:' : 'Опишите, почему:'}
                      </Label>
                      <Textarea
                        id="resistance-notes"
                        value={entry.resistanceNotes}
                        onChange={(e) => setEntry(prev => ({ ...prev, resistanceNotes: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Совет:</strong> Даже если не удалось полностью отказаться от ритуала — это не поражение! Учитесь замечать малейшие моменты, когда вы хотя бы ненадолго остановились и задумались. Это уже рост!
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        );

      case 'observer':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">3. Использовали ли вы практику "отдалённого наблюдателя" сегодня?</Label>
              <RadioGroup 
                value={entry.usedObserverPractice} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, usedObserverPractice: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="observer-yes" />
                  <Label htmlFor="observer-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="observer-no" />
                  <Label htmlFor="observer-no">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            {entry.usedObserverPractice === 'no' && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Совет:</strong> Попробуйте на этой неделе потренироваться: когда возникает тревожная мысль, скажите себе: "Это просто мысль. Она уйдёт так же, как появилась".
                </AlertDescription>
              </Alert>
            )}

            {entry.usedObserverPractice === 'yes' && (
              <>
                <div>
                  <Label htmlFor="observed-thought">3.1. Какую мысль вы наблюдали "со стороны"?</Label>
                  <Textarea
                    id="observed-thought"
                    value={entry.observedThought}
                    onChange={(e) => setEntry(prev => ({ ...prev, observedThought: e.target.value }))}
                    placeholder="Опишите мысль..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">3.2. Как вы её обозначили?</Label>
                  <RadioGroup 
                    value={entry.thoughtLabel} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, thoughtLabel: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="just-thought" id="just-thought" />
                      <Label htmlFor="just-thought">"Это всего лишь мысль, а не реальность"</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-action" id="not-action" />
                      <Label htmlFor="not-action">"Мысли не равно действия"</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="can-resist" id="can-resist" />
                      <Label htmlFor="can-resist">"Я могу испытывать тревогу и не делать ритуал"</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">3.3. Сколько времени выдержали тревогу без ритуала?</Label>
                  <RadioGroup 
                    value={entry.resistanceTime} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, resistanceTime: value }))}
                    className="mt-2"
                  >
                    {[
                      'До 1 минуты',
                      '1–5 минут',
                      '5–15 минут',
                      'Более 15 минут'
                    ].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={`resist-${time}`} />
                        <Label htmlFor={`resist-${time}`}>{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="observer-emotions">3.4. Какие ощущения или эмоции испытали?</Label>
                  <Textarea
                    id="observer-emotions"
                    value={entry.observerEmotions}
                    onChange={(e) => setEntry(prev => ({ ...prev, observerEmotions: e.target.value }))}
                    placeholder="Опишите ощущения..."
                    className="mt-2"
                  />
                </div>

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Совет:</strong> Даже минута без ритуала — шаг вперёд! Отмечайте любые успехи, даже самые маленькие.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        );

      case 'breathing':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">4. Применяли ли вы дыхательные упражнения или осознанность для снижения тревоги?</Label>
              <RadioGroup 
                value={entry.usedBreathing} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, usedBreathing: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="breathing-yes" />
                  <Label htmlFor="breathing-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="breathing-no" />
                  <Label htmlFor="breathing-no">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            {entry.usedBreathing === 'no' && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Совет:</strong> Попробуйте 4–4–6 дыхание: вдох — 4 сек, пауза — 4 сек, выдох — 6 сек. Это поможет переключить внимание с тревожных мыслей на ощущения в теле.
                </AlertDescription>
              </Alert>
            )}

            {entry.usedBreathing === 'yes' && (
              <>
                <div>
                  <Label className="text-base font-medium">4.1. Сколько времени посвятили практике?</Label>
                  <RadioGroup 
                    value={entry.breathingTime} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, breathingTime: value }))}
                    className="mt-2"
                  >
                    {[
                      'Менее 1 минуты',
                      '1–5 минут',
                      '5–10 минут',
                      'Более 10 минут'
                    ].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <RadioGroupItem value={time} id={`breathing-${time}`} />
                        <Label htmlFor={`breathing-${time}`}>{time}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">4.2. Оцените тревогу до и после практики:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="breathing-before">До (0-10):</Label>
                      <Input
                        id="breathing-before"
                        type="number"
                        min="0"
                        max="10"
                        value={entry.breathingAnxietyBefore}
                        onChange={(e) => setEntry(prev => ({ ...prev, breathingAnxietyBefore: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="breathing-after">После (0-10):</Label>
                      <Input
                        id="breathing-after"
                        type="number"
                        min="0"
                        max="10"
                        value={entry.breathingAnxietyAfter}
                        onChange={(e) => setEntry(prev => ({ ...prev, breathingAnxietyAfter: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="breathing-sensations">4.3. Какие ощущения после практики?</Label>
                  <Textarea
                    id="breathing-sensations"
                    value={entry.breathingSensations}
                    onChange={(e) => setEntry(prev => ({ ...prev, breathingSensations: e.target.value }))}
                    placeholder="Опишите ощущения..."
                    className="mt-2"
                  />
                </div>

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Совет:</strong> Регулярная практика дыхания и осознанности постепенно снижает общий уровень тревоги. Замечайте, как меняется ваше самочувствие с каждым разом.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        );

      case 'rituals':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">5. Ведёте ли вы список ритуалов по степени трудности отказа?</Label>
              <RadioGroup 
                value={entry.hasRitualsList} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, hasRitualsList: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="rituals-yes" />
                  <Label htmlFor="rituals-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="rituals-no" />
                  <Label htmlFor="rituals-no">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            {entry.hasRitualsList === 'no' && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  <strong>Совет:</strong> Попробуйте составить такой список. Начните с самых лёгких ритуалов, чтобы учиться отказываться от них без сильного стресса.
                </AlertDescription>
              </Alert>
            )}

            {entry.hasRitualsList === 'yes' && (
              <>
                <div>
                  <Label className="text-base font-medium">5.1. С какими ритуалами удалось поработать сегодня?</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="easy-ritual"
                        checked={entry.ritualWork.includes('easy')}
                        onCheckedChange={() => handleRitualWorkToggle('easy')}
                      />
                      <Label htmlFor="easy-ritual" className="text-sm">Самый лёгкий</Label>
                    </div>
                    {entry.ritualWork.includes('easy') && (
                      <Textarea
                        placeholder="Опишите..."
                        className="mt-2"
                      />
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medium-ritual"
                        checked={entry.ritualWork.includes('medium')}
                        onCheckedChange={() => handleRitualWorkToggle('medium')}
                      />
                      <Label htmlFor="medium-ritual" className="text-sm">Средней трудности</Label>
                    </div>
                    {entry.ritualWork.includes('medium') && (
                      <Textarea
                        placeholder="Опишите..."
                        className="mt-2"
                      />
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hard-ritual"
                        checked={entry.ritualWork.includes('hard')}
                        onCheckedChange={() => handleRitualWorkToggle('hard')}
                      />
                      <Label htmlFor="hard-ritual" className="text-sm">Самый сложный</Label>
                    </div>
                    {entry.ritualWork.includes('hard') && (
                      <Textarea
                        placeholder="Опишите..."
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">5.2. Удалось ли уменьшить количество/интенсивность ритуалов?</Label>
                  <RadioGroup 
                    value={entry.ritualProgress} 
                    onValueChange={(value) => setEntry(prev => ({ ...prev, ritualProgress: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="progress-yes" />
                      <Label htmlFor="progress-yes">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="progress-no" />
                      <Label htmlFor="progress-no">Нет</Label>
                    </div>
                  </RadioGroup>

                  {entry.ritualProgress && (
                    <div className="mt-4">
                      <Label htmlFor="progress-notes">
                        {entry.ritualProgress === 'yes' ? 'Что помогло?' : 'Что помешало?'}
                      </Label>
                      <Textarea
                        id="progress-notes"
                        value={entry.progressNotes}
                        onChange={(e) => setEntry(prev => ({ ...prev, progressNotes: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Совет:</strong> Работа с простыми ритуалами — отличная тренировка. Не спешите: шаг за шагом вы сможете ослабить самые стойкие привычки.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="support-letter">6. Короткое поддерживающее письмо себе</Label>
              <p className="text-sm text-gray-600 mt-1">
                Напишите себе короткое сообщение поддержки (например: «Сегодня я сделал(а) всё, что мог(ла). Даже если было тяжело, я молодец!»)
              </p>
              <Textarea
                id="support-letter"
                value={entry.supportLetter}
                onChange={(e) => setEntry(prev => ({ ...prev, supportLetter: e.target.value }))}
                placeholder="Напишите поддерживающее сообщение..."
                className="mt-2"
                rows={4}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Желаете ли сохранить это письмо, чтобы перечитать позже?</Label>
              <RadioGroup 
                value={entry.saveSupport} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, saveSupport: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="save-yes" />
                  <Label htmlFor="save-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="save-no" />
                  <Label htmlFor="save-no">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Совет:</strong> Возвращайтесь к своим поддерживающим посланиям в трудные дни — ваши слова имеют силу!
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'reflection':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">7. Общая рефлексия дня</h3>

            <div>
              <Label htmlFor="day-hard">Что было самым трудным сегодня?</Label>
              <Textarea
                id="day-hard"
                value={entry.dayReflectionHard}
                onChange={(e) => setEntry(prev => ({ ...prev, dayReflectionHard: e.target.value }))}
                placeholder="Опишите трудности..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="day-good">Что получилось лучше, чем обычно?</Label>
              <Textarea
                id="day-good"
                value={entry.dayReflectionGood}
                onChange={(e) => setEntry(prev => ({ ...prev, dayReflectionGood: e.target.value }))}
                placeholder="Отметьте успехи..."
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Есть ли желание обсудить сегодняшний опыт с близким или специалистом?</Label>
              <RadioGroup 
                value={entry.wantDiscuss} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, wantDiscuss: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="discuss-yes" />
                  <Label htmlFor="discuss-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="discuss-no" />
                  <Label htmlFor="discuss-no">Нет</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="tomorrow-steps">Какие шаги хочу попробовать завтра для самоподдержки?</Label>
              <Textarea
                id="tomorrow-steps"
                value={entry.tomorrowSteps}
                onChange={(e) => setEntry(prev => ({ ...prev, tomorrowSteps: e.target.value }))}
                placeholder="Планы на завтра..."
                className="mt-2"
              />
            </div>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Совет:</strong> Вечерняя рефлексия помогает замечать свой прогресс. Даже если день был непростым — это тоже ценный опыт.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">8. Если тревога была особенно сильной</h3>

            <div>
              <Label htmlFor="need-help">Что/кто мог бы помочь прямо сейчас?</Label>
              <Textarea
                id="need-help"
                value={entry.needHelp}
                onChange={(e) => setEntry(prev => ({ ...prev, needHelp: e.target.value }))}
                placeholder="Опишите, что может помочь..."
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Есть ли мысли обратиться к специалисту за поддержкой?</Label>
              <RadioGroup 
                value={entry.seekProfessional} 
                onValueChange={(value) => setEntry(prev => ({ ...prev, seekProfessional: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="seek-yes" />
                  <Label htmlFor="seek-yes">Да</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="seek-no" />
                  <Label htmlFor="seek-no">Нет</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="already" id="seek-already" />
                  <Label htmlFor="seek-already">Уже обратился(ась)</Label>
                </div>
              </RadioGroup>
            </div>

            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>Совет:</strong> Просить о помощи — признак зрелости и заботы о себе. Не стесняйтесь обращаться за поддержкой к специалистам и близким.
              </AlertDescription>
            </Alert>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>P.S.</strong> Любое заполнение дневника — вклад в ваш путь к свободе от ОКР. Даже если кажется, что прогресса нет, вы учитесь замечать себя и заботиться о себе!
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardTitle className="text-2xl">Дневник работы с ОКР</CardTitle>
            <p className="text-purple-100">
              Шаг {currentStep + 1} из {steps.length}: {steps[currentStep].title}
            </p>
            <div className="w-full bg-purple-300/30 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {renderStep()}

            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>

              <div className="flex space-x-2">
                {currentStep === steps.length - 1 ? (
                  <Button onClick={saveEntry} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить дневник
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OCDDiary;
