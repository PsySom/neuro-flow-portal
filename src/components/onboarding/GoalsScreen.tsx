
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface GoalsScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const GoalsScreen: React.FC<GoalsScreenProps> = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { id: 'reduce-anxiety', title: 'Снизить тревожность', emoji: '🌿' },
    { id: 'improve-mood', title: 'Улучшить настроение', emoji: '☀️' },
    { id: 'boost-self-esteem', title: 'Повысить самооценку', emoji: '💎' },
    { id: 'manage-stress', title: 'Справиться со стрессом', emoji: '🧘' },
    { id: 'better-sleep', title: 'Улучшить сон', emoji: '🌙' },
    { id: 'productivity', title: 'Повысить продуктивность', emoji: '🎯' },
    { id: 'mindfulness', title: 'Развить осознанность', emoji: '🧠' },
    { id: 'life-balance', title: 'Найти баланс в жизни', emoji: '⚖️' },
    { id: 'relationships', title: 'Улучшить отношения', emoji: '💝' },
    { id: 'self-care', title: 'Заботиться о себе', emoji: '🌸' },
    { id: 'habits', title: 'Развить полезные привычки', emoji: '📈' },
    { id: 'thoughts', title: 'Работать с мыслями', emoji: '💭' }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < 5) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    onNext({ goals: selectedGoals });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={87.5} className="mb-4" />
        <p className="text-sm text-gray-500">7 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Чего вы хотите достичь с PsyBalans?
      </h2>
      <p className="text-gray-600 mb-6">Выберите 3-5 главных целей</p>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all hover:bg-gray-50 ${
              selectedGoals.includes(goal.id) ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{goal.emoji}</span>
                <span className="text-sm font-medium text-gray-900">{goal.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Выбрано: {selectedGoals.length} из 5
      </p>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={selectedGoals.length < 3}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default GoalsScreen;
