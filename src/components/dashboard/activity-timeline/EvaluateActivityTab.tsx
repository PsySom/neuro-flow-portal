
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Mic } from 'lucide-react';

const EvaluateActivityTab: React.FC = () => {
  const [satisfaction, setSatisfaction] = useState([5]);
  const [processSatisfaction, setProcessSatisfaction] = useState([5]);
  const [fatigue, setFatigue] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [note, setNote] = useState('');

  const handleSave = () => {
    console.log('Saving evaluation:', {
      satisfaction: satisfaction[0],
      processSatisfaction: processSatisfaction[0],
      fatigue: fatigue[0],
      stress: stress[0],
      note
    });
  };

  const handleGoToDiary = () => {
    console.log('Navigate to diary');
  };

  return (
    <div className="space-y-6">
      {/* Краткая информация об активности */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Информация об активности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🏃‍♂️</span>
              <span className="font-medium">Зарядка</span>
            </div>
            <div className="text-sm text-gray-600">
              <span>08:30-09:30 • 1 час • </span>
              <div className="inline-flex items-center">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Восстанавливающая активность
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Шкалы оценки */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Оценка активности</h3>
        
        {/* Удовлетворенность процессом */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Удовлетворенность процессом</Label>
            <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">
              {processSatisfaction[0]}/10
            </span>
          </div>
          <Slider
            value={processSatisfaction}
            onValueChange={setProcessSatisfaction}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Процесс не понравился</span>
            <span>Процесс очень понравился</span>
          </div>
        </div>

        {/* Удовлетворенность результатом */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Удовлетворенность результатом</Label>
            <span className="text-sm font-medium bg-emerald-100 px-2 py-1 rounded">
              {satisfaction[0]}/10
            </span>
          </div>
          <Slider
            value={satisfaction}
            onValueChange={setSatisfaction}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Совсем не удовлетворен</span>
            <span>Полностью удовлетворен</span>
          </div>
        </div>

        {/* Затраты энергии */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Затраты энергии</Label>
            <span className="text-sm font-medium bg-purple-100 px-2 py-1 rounded">
              {fatigue[0]}/10
            </span>
          </div>
          <Slider
            value={fatigue}
            onValueChange={setFatigue}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Очень легко</span>
            <span>Очень трудно</span>
          </div>
        </div>

        {/* Уровень стресса */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Уровень стресса</Label>
            <span className="text-sm font-medium bg-red-100 px-2 py-1 rounded">
              {stress[0]}/10
            </span>
          </div>
          <Slider
            value={stress}
            onValueChange={setStress}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Нет стресса</span>
            <span>Сильный стресс</span>
          </div>
        </div>
      </div>

      {/* Кнопка сохранить оценку */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          Сохранить оценку
        </Button>
      </div>

      {/* Заметка */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold">Оставить заметку</h3>
        
        <div className="space-y-2">
          <Label htmlFor="evaluation-note">Заметка</Label>
          <div className="relative">
            <Textarea
              id="evaluation-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Поделитесь своими мыслями об активности..."
              rows={4}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8"
              title="Голосовой ввод"
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleSave} variant="outline">
            Сохранить заметку
          </Button>
          <Button onClick={handleGoToDiary} className="bg-purple-600 hover:bg-purple-700">
            Перейти в дневник самооценки и мыслей
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluateActivityTab;
