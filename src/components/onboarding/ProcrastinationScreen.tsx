import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ProcrastinationScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ProcrastinationScreen: React.FC<ProcrastinationScreenProps> = ({ onNext, onBack }) => {
  const [procrastinationFrequency, setProcrastinationFrequency] = useState('');
  const [barriers, setBarriers] = useState<string[]>([]);
  const [approach, setApproach] = useState('');

  const barrierOptions = [
    { id: 'perfectionism', title: 'Страх сделать неидеально', emoji: '😰' },
    { id: 'overwhelming', title: 'Задача кажется слишком большой', emoji: '🌊' },
    { id: 'starting', title: 'Не знаю, с чего начать', emoji: '😕' },
    { id: 'distraction', title: 'Отвлекаюсь на мелочи', emoji: '⚡' },
    { id: 'overthinking', title: 'Слишком много думаю, мало делаю', emoji: '💭' },
    { id: 'energy', title: 'Не хватает энергии или мотивации', emoji: '🔋' },
    { id: 'planning', title: 'Плохо планирую время', emoji: '⏰' },
    { id: 'social-media', title: 'Отвлекаюсь на соцсети и развлечения', emoji: '📱' }
  ];

  const toggleBarrier = (barrierId: string) => {
    setBarriers(prev => {
      if (prev.includes(barrierId)) {
        return prev.filter(id => id !== barrierId);
      } else if (prev.length < 3) {
        return [...prev, barrierId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    onNext({
      procrastinationFrequency,
      barriers,
      approach
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={56.25} className="mb-4" />
        <p className="text-sm text-gray-500">9 из 16 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Прокрастинация и мотивация
      </h2>
      <p className="text-gray-600 mb-6">
        Понимание ваших паттернов поможет нам предложить эффективные стратегии
      </p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как часто вы откладываете важные дела?
          </Label>
          <RadioGroup value={procrastinationFrequency} onValueChange={setProcrastinationFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="proc-never" />
              <Label htmlFor="proc-never">Практически никогда - выполняю задачи вовремя</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="proc-sometimes" />
              <Label htmlFor="proc-sometimes">Иногда откладываю сложные или неприятные задачи</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="often" id="proc-often" />
              <Label htmlFor="proc-often">Часто откладываю - это создает мне стресс</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="constantly" id="proc-constantly" />
              <Label htmlFor="proc-constantly">Постоянно борюсь с прокрастинацией</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Что чаще всего мешает вам начать действовать? (до 3 вариантов)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {barrierOptions.map((barrier) => (
              <Card
                key={barrier.id}
                className={`cursor-pointer transition-all hover:bg-gray-50 ${
                  barriers.includes(barrier.id) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                }`}
                onClick={() => toggleBarrier(barrier.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{barrier.emoji}</span>
                    <span className="text-sm font-medium text-gray-900">{barrier.title}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Выбрано: {barriers.length} из 3
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Какой подход к выполнению задач вам ближе?
          </Label>
          <RadioGroup value={approach} onValueChange={setApproach}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all-at-once" id="approach-all" />
              <Label htmlFor="approach-all">Делаю все сразу, пока есть настрой</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small-steps" id="approach-steps" />
              <Label htmlFor="approach-steps">Разбиваю на маленькие шаги</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deadline-pressure" id="approach-deadline" />
              <Label htmlFor="approach-deadline">Работаю в последний момент под давлением дедлайна</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="planned" id="approach-planned" />
              <Label htmlFor="approach-planned">Планирую заранее и следую расписанию</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!procrastinationFrequency || !approach}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default ProcrastinationScreen;