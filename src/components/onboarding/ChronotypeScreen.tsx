
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ChronotypeScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ChronotypeScreen: React.FC<ChronotypeScreenProps> = ({ onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState('');
  const [wakeTime, setWakeTime] = useState([7]);
  const [sleepTime, setSleepTime] = useState([23]);

  const chronotypes = [
    {
      id: 'lark',
      title: 'Жаворонок',
      description: 'Легко встаю рано, продуктивен утром',
      emoji: '🌅',
      color: 'bg-orange-100 border-orange-200 hover:bg-orange-200'
    },
    {
      id: 'owl',
      title: 'Сова',
      description: 'Поздно ложусь, продуктивен вечером',
      emoji: '🌙',
      color: 'bg-blue-100 border-blue-200 hover:bg-blue-200'
    },
    {
      id: 'normal',
      title: 'Обычный ритм',
      description: 'Средние время сна и активности',
      emoji: '☀️',
      color: 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200'
    },
    {
      id: 'shift',
      title: 'Сменный график',
      description: 'Нерегулярный режим работы',
      emoji: '🔄',
      color: 'bg-purple-100 border-purple-200 hover:bg-purple-200'
    }
  ];

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const handleSubmit = () => {
    onNext({
      chronotype: selectedType,
      wakeTime: wakeTime[0],
      sleepTime: sleepTime[0]
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={37.5} className="mb-4" />
        <p className="text-sm text-gray-500">3 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Какой у вас режим дня?</h2>
      <p className="text-gray-600 mb-6">Это поможет нам предлагать активности в подходящее время</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {chronotypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all ${type.color} ${
              selectedType === type.id ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{type.emoji}</div>
              <h3 className="font-medium text-gray-900 mb-1">{type.title}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Время пробуждения: {formatTime(wakeTime[0])}
          </Label>
          <Slider
            value={wakeTime}
            onValueChange={setWakeTime}
            max={12}
            min={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Время отхода ко сну: {formatTime(sleepTime[0])}
          </Label>
          <Slider
            value={sleepTime}
            onValueChange={setSleepTime}
            max={26}
            min={20}
            step={1}
            className="mt-2"
          />
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!selectedType}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default ChronotypeScreen;
