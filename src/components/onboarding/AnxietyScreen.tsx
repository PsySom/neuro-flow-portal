import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AnxietyScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const AnxietyScreen: React.FC<AnxietyScreenProps> = ({ onNext, onBack }) => {
  const [anxietyFrequency, setAnxietyFrequency] = useState('');
  const [anxietyTriggers, setAnxietyTriggers] = useState<string[]>([]);
  const [anxietySymptoms, setAnxietySymptoms] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);

  const triggerOptions = [
    { id: 'morning', title: 'Утром, думая о предстоящем дне', emoji: '🌅' },
    { id: 'meetings', title: 'Перед важными встречами или событиями', emoji: '💼' },
    { id: 'evening', title: 'Вечером, анализируя прошедший день', emoji: '🌙' },
    { id: 'messages', title: 'При получении сообщений или звонков', emoji: '📱' },
    { id: 'new-situations', title: 'В новых или незнакомых ситуациях', emoji: '🚪' },
    { id: 'social', title: 'В социальных ситуациях', emoji: '👥' },
    { id: 'decisions', title: 'При принятии решений', emoji: '🎯' },
    { id: 'future', title: 'Думая о будущем', emoji: '🔮' }
  ];

  const symptomOptions = [
    { id: 'thoughts', title: 'Навязчивые мысли и переживания', emoji: '🧠' },
    { id: 'physical', title: 'Физические симптомы (сердцебиение, напряжение)', emoji: '💓' },
    { id: 'sleep', title: 'Проблемы с засыпанием', emoji: '😴' },
    { id: 'checking', title: 'Постоянная проверка и перепроверка', emoji: '🔄' },
    { id: 'avoidance', title: 'Избегание звонков или сообщений', emoji: '📱' },
    { id: 'procrastination', title: 'Откладывание важных дел', emoji: '🚫' },
    { id: 'catastrophizing', title: 'Катастрофические сценарии в голове', emoji: '😰' },
    { id: 'decisions', title: 'Трудности с принятием решений', emoji: '🤐' }
  ];

  const copingOptions = [
    { id: 'breathing', title: 'Дыхательные упражнения', emoji: '🌬️', healthy: true },
    { id: 'exercise', title: 'Физическая активность', emoji: '🚶', healthy: true },
    { id: 'meditation', title: 'Медитация или mindfulness', emoji: '🧘', healthy: true },
    { id: 'talking', title: 'Разговор с близкими', emoji: '🤝', healthy: true },
    { id: 'writing', title: 'Записывание мыслей', emoji: '✍️', healthy: true },
    { id: 'music', title: 'Музыка или подкасты', emoji: '🎵', healthy: true },
    { id: 'nature', title: 'Время на природе', emoji: '🌳', healthy: true },
    { id: 'reading', title: 'Чтение или изучение новой информации', emoji: '📚', healthy: true },
    { id: 'alcohol', title: 'Алкоголь', emoji: '🍷', healthy: false },
    { id: 'eating', title: 'Заедание стресса сладким', emoji: '🍫', healthy: false },
    { id: 'shopping', title: 'Импульсивные покупки', emoji: '🛒', healthy: false },
    { id: 'phone', title: 'Отвлечение на телефон', emoji: '📱', healthy: false },
    { id: 'games', title: 'Видеоигры', emoji: '🎮', healthy: false },
    { id: 'tv', title: 'Просмотр видео/сериалов', emoji: '📺', healthy: false },
    { id: 'smoking', title: 'Курение', emoji: '🚬', healthy: false },
    { id: 'avoidance', title: 'Избегание ситуаций', emoji: '🙈', healthy: false },
    { id: 'medication', title: 'Успокоительные без назначения врача', emoji: '💊', healthy: false }
  ];

  const toggleSelection = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, maxCount?: number) => {
    setter(prev => {
      if (prev.includes(item)) {
        return prev.filter(id => id !== item);
      } else if (!maxCount || prev.length < maxCount) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    onNext({
      anxietyFrequency,
      anxietyTriggers,
      anxietySymptoms,
      copingStrategies
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={62.5} className="mb-4" />
        <p className="text-sm text-gray-500">10 из 16 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Тревожность и беспокойство
      </h2>
      <p className="text-gray-600 mb-6">
        Понимание ваших триггеров поможет нам создать эффективные стратегии поддержки
      </p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как часто вы испытываете тревогу?
          </Label>
          <RadioGroup value={anxietyFrequency} onValueChange={setAnxietyFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="anxiety-never" />
              <Label htmlFor="anxiety-never">Практически никогда</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="anxiety-sometimes" />
              <Label htmlFor="anxiety-sometimes">Иногда в стрессовых ситуациях</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="often" id="anxiety-often" />
              <Label htmlFor="anxiety-often">Часто беспокоюсь и тревожусь</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="constantly" id="anxiety-constantly" />
              <Label htmlFor="anxiety-constantly">Постоянно нахожусь в состоянии тревоги</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Когда вы чаще всего чувствуете тревогу? (несколько вариантов)
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {triggerOptions.map((trigger) => (
              <div key={trigger.id} className="flex items-center space-x-2">
                <Checkbox
                  id={trigger.id}
                  checked={anxietyTriggers.includes(trigger.id)}
                  onCheckedChange={() => toggleSelection(trigger.id, setAnxietyTriggers)}
                />
                <Label htmlFor={trigger.id} className="flex items-center space-x-2">
                  <span>{trigger.emoji}</span>
                  <span>{trigger.title}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как обычно проявляется ваша тревога? (несколько вариантов)
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {symptomOptions.map((symptom) => (
              <div key={symptom.id} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom.id}
                  checked={anxietySymptoms.includes(symptom.id)}
                  onCheckedChange={() => toggleSelection(symptom.id, setAnxietySymptoms)}
                />
                <Label htmlFor={symptom.id} className="flex items-center space-x-2">
                  <span>{symptom.emoji}</span>
                  <span>{symptom.title}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Что помогает вам справляться с тревогой? (несколько вариантов)
          </Label>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2">Здоровые стратегии:</h4>
              <div className="grid grid-cols-1 gap-2">
                {copingOptions.filter(option => option.healthy).map((strategy) => (
                  <div key={strategy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={strategy.id}
                      checked={copingStrategies.includes(strategy.id)}
                      onCheckedChange={() => toggleSelection(strategy.id, setCopingStrategies)}
                    />
                    <Label htmlFor={strategy.id} className="flex items-center space-x-2">
                      <span>{strategy.emoji}</span>
                      <span>{strategy.title}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-orange-700 mb-2">Деструктивные стратегии:</h4>
              <div className="grid grid-cols-1 gap-2">
                {copingOptions.filter(option => !option.healthy).map((strategy) => (
                  <div key={strategy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={strategy.id}
                      checked={copingStrategies.includes(strategy.id)}
                      onCheckedChange={() => toggleSelection(strategy.id, setCopingStrategies)}
                    />
                    <Label htmlFor={strategy.id} className="flex items-center space-x-2">
                      <span>{strategy.emoji}</span>
                      <span>{strategy.title}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!anxietyFrequency}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default AnxietyScreen;