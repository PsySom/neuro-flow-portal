
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChallengesScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ onNext, onBack }) => {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [otherChallenge, setOtherChallenge] = useState('');

  const challenges = [
    { id: 'anxiety', title: 'Тревога и беспокойство', emoji: '🧠', color: 'bg-blue-100 border-blue-200' },
    { id: 'stress', title: 'Стресс и напряжение', emoji: '⚡', color: 'bg-red-100 border-red-200' },
    { id: 'procrastination', title: 'Прокрастинация и откладывание дел', emoji: '⏰', color: 'bg-orange-100 border-orange-200' },
    { id: 'self-esteem', title: 'Низкая самооценка', emoji: '💙', color: 'bg-purple-100 border-purple-200' },
    { id: 'sleep', title: 'Проблемы со сном', emoji: '😴', color: 'bg-indigo-100 border-indigo-200' },
    { id: 'energy', title: 'Недостаток энергии', emoji: '🔋', color: 'bg-green-100 border-green-200' },
    { id: 'focus', title: 'Трудности с концентрацией', emoji: '🎯', color: 'bg-yellow-100 border-yellow-200' },
    { id: 'mood', title: 'Перепады настроения', emoji: '🌈', color: 'bg-pink-100 border-pink-200' },
    { id: 'loneliness', title: 'Одиночество', emoji: '🤝', color: 'bg-teal-100 border-teal-200' },
    { id: 'burnout', title: 'Выгорание', emoji: '🔥', color: 'bg-red-100 border-red-200' },
    { id: 'relationships', title: 'Проблемы в отношениях', emoji: '❤️', color: 'bg-rose-100 border-rose-200' }
  ];

  const toggleChallenge = (challengeId: string) => {
    setSelectedChallenges(prev => {
      if (prev.includes(challengeId)) {
        return prev.filter(id => id !== challengeId);
      } else if (prev.length < 5) {
        return [...prev, challengeId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    const challengesData = {
      challenges: selectedChallenges,
      otherChallenge: otherChallenge.trim()
    };
    onNext(challengesData);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={62.5} className="mb-4" />
        <p className="text-sm text-gray-500">5 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        С какими сложностями вы сталкиваетесь?
      </h2>
      <p className="text-gray-600 mb-6">
        Выберите то, что беспокоит вас чаще всего (до 5 вариантов)
      </p>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`cursor-pointer transition-all ${challenge.color} ${
              selectedChallenges.includes(challenge.id) ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => toggleChallenge(challenge.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{challenge.emoji}</span>
                <span className="text-sm font-medium text-gray-900">{challenge.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Другое (опишите своими словами)
        </label>
        <Input
          placeholder="Опишите, что вас беспокоит..."
          value={otherChallenge}
          onChange={(e) => setOtherChallenge(e.target.value)}
        />
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Выбрано: {selectedChallenges.length} из 5
      </p>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={selectedChallenges.length === 0 && !otherChallenge.trim()}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default ChallengesScreen;
