
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CurrentStateScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const CurrentStateScreen: React.FC<CurrentStateScreenProps> = ({ onNext, onBack }) => {
  const [mood, setMood] = useState([0]);
  const [energy, setEnergy] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');

  const getMoodEmoji = (value: number) => {
    if (value <= -3) return '😔';
    if (value <= -1) return '😕';
    if (value <= 1) return '😐';
    if (value <= 3) return '🙂';
    return '😄';
  };

  const handleSubmit = () => {
    onNext({
      mood: mood[0],
      energy,
      sleep,
      stress
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={50} className="mb-4" />
        <p className="text-sm text-gray-500">4 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Как вы себя чувствуете в последнее время?
      </h2>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Общее настроение: {getMoodEmoji(mood[0])} ({mood[0] > 0 ? '+' : ''}{mood[0]})
          </Label>
          <Slider
            value={mood}
            onValueChange={setMood}
            max={5}
            min={-5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>😔 Плохо</span>
            <span>😐 Нормально</span>
            <span>😄 Отлично</span>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Уровень энергии</Label>
          <RadioGroup value={energy} onValueChange={setEnergy}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-low" id="energy-very-low" />
              <Label htmlFor="energy-very-low">Очень низкий</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="energy-low" />
              <Label htmlFor="energy-low">Низкий</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="energy-medium" />
              <Label htmlFor="energy-medium">Средний</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="energy-high" />
              <Label htmlFor="energy-high">Высокий</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-high" id="energy-very-high" />
              <Label htmlFor="energy-very-high">Очень высокий</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Качество сна</Label>
          <RadioGroup value={sleep} onValueChange={setSleep}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="sleep-poor" />
              <Label htmlFor="sleep-poor">Плохое</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="sleep-fair" />
              <Label htmlFor="sleep-fair">Удовлетворительное</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="sleep-good" />
              <Label htmlFor="sleep-good">Хорошее</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excellent" id="sleep-excellent" />
              <Label htmlFor="sleep-excellent">Отличное</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Уровень стресса</Label>
          <RadioGroup value={stress} onValueChange={setStress}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="stress-low" />
              <Label htmlFor="stress-low">Низкий</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="stress-moderate" />
              <Label htmlFor="stress-moderate">Умеренный</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="stress-high" />
              <Label htmlFor="stress-high">Высокий</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="very-high" id="stress-very-high" />
              <Label htmlFor="stress-very-high">Очень высокий</Label>
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
          disabled={!energy || !sleep || !stress}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default CurrentStateScreen;
