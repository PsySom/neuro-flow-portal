
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FirstCheckinProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const FirstCheckin: React.FC<FirstCheckinProps> = ({ onNext, onBack }) => {
  const [ratings, setRatings] = useState({
    physical: [5],
    emotional: [5],
    social: [5],
    cognitive: [5],
    spiritual: [5]
  });
  const [dayDescription, setDayDescription] = useState('');

  const categories = [
    { 
      key: 'physical', 
      title: 'Физические потребности', 
      description: 'сон, еда, движение' 
    },
    { 
      key: 'emotional', 
      title: 'Эмоциональные потребности', 
      description: 'спокойствие, радость' 
    },
    { 
      key: 'social', 
      title: 'Социальные потребности', 
      description: 'общение, поддержка' 
    },
    { 
      key: 'cognitive', 
      title: 'Когнитивные потребности', 
      description: 'ясность, фокус' 
    },
    { 
      key: 'spiritual', 
      title: 'Духовные потребности', 
      description: 'смысл, цели' 
    }
  ];

  const handleRatingChange = (category: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    const checkinData = {
      baselineRatings: ratings,
      dayDescription: dayDescription.trim()
    };
    onNext(checkinData);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Давайте зафиксируем ваше текущее состояние
      </h2>
      <p className="text-gray-600 mb-8">
        Это поможет отслеживать ваш прогресс в будущем
      </p>
      
      <div className="space-y-8 mb-8">
        {categories.map((category) => (
          <div key={category.key}>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {category.title} ({category.description})
            </Label>
            <div className="mb-2">
              <Slider
                value={ratings[category.key as keyof typeof ratings]}
                onValueChange={(value) => handleRatingChange(category.key, value)}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 - Очень плохо</span>
              <span className="font-medium">
                {ratings[category.key as keyof typeof ratings][0]}/10
              </span>
              <span>10 - Отлично</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Как прошел ваш день?
        </Label>
        <Textarea
          placeholder="Опишите ваш день, настроение, важные события..."
          value={dayDescription}
          onChange={(e) => setDayDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          Сохранить и перейти в приложение
        </Button>
      </div>
    </div>
  );
};

export default FirstCheckin;
