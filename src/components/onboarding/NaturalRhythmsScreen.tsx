import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface NaturalRhythmsScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const NaturalRhythmsScreen: React.FC<NaturalRhythmsScreenProps> = ({ onNext, onBack, isLoading = false }) => {
  const [activeTime, setActiveTime] = useState('');
  const [wakeTime, setWakeTime] = useState([7]);
  const [sleepTime, setSleepTime] = useState([23]);
  const [sleepQuality, setSleepQuality] = useState('');

  const activeTimeOptions = [
    {
      id: 'morning',
      title: 'Утром',
      description: 'Легко просыпаюсь, продуктивен до обеда',
      emoji: '🌅'
    },
    {
      id: 'day',
      title: 'Днем',
      description: 'Пик активности в середине дня',
      emoji: '🌞'
    },
    {
      id: 'evening',
      title: 'Вечером',
      description: 'Становлюсь активнее после 18:00',
      emoji: '🌙'
    },
    {
      id: 'varies',
      title: 'По-разному',
      description: 'Зависит от обстоятельств',
      emoji: '🔄'
    }
  ];

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleSubmit = () => {
    onNext({
      activeTime,
      wakeTime: wakeTime[0],
      sleepTime: sleepTime[0],
      sleepQuality
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={18.75} className="mb-4" />
        <p className="text-sm text-gray-500">3 из 16 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ваши естественные ритмы</h2>
      <p className="text-gray-600 mb-6">Это поможет нам предлагать активности в подходящее время</p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Когда вы чувствуете себя наиболее активным?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {activeTimeOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:bg-gray-50 ${
                  activeTime === option.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
                }`}
                onClick={() => setActiveTime(option.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            В какое время вы обычно просыпаетесь? {formatTime(wakeTime[0])}
          </Label>
          <Slider
            value={wakeTime}
            onValueChange={setWakeTime}
            max={12}
            min={5}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5:00</span>
            <span>12:00</span>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            В какое время обычно ложитесь спать? {formatTime(sleepTime[0])}
          </Label>
          <Slider
            value={sleepTime}
            onValueChange={setSleepTime}
            max={30}
            min={22}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>22:00</span>
            <span>06:00</span>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Как вы оцениваете качество своего сна?
          </Label>
          <RadioGroup value={sleepQuality} onValueChange={setSleepQuality}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="sleep-poor" />
              <Label htmlFor="sleep-poor">Сплю плохо, часто просыпаюсь</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="sleep-light" />
              <Label htmlFor="sleep-light">Сон неглубокий, просыпаюсь уставшим</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="sleep-normal" />
              <Label htmlFor="sleep-normal">В целом сплю нормально</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="sleep-good" />
              <Label htmlFor="sleep-good">Сон глубокий и восстанавливающий</Label>
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
          disabled={!activeTime || !sleepQuality || isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
};

export default NaturalRhythmsScreen;