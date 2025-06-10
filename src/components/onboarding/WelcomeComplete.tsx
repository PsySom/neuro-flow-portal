
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface WelcomeCompleteProps {
  userData: any;
  onNext: (data: any) => void;
}

const WelcomeComplete: React.FC<WelcomeCompleteProps> = ({ userData, onNext }) => {
  const getChronotypeLabel = (type: string) => {
    switch (type) {
      case 'lark': return 'Жаворонок';
      case 'owl': return 'Сова';
      case 'normal': return 'Обычный ритм';
      case 'shift': return 'Сменный график';
      default: return 'Не указано';
    }
  };

  const getTopGoals = () => {
    const goalLabels: { [key: string]: string } = {
      'reduce-anxiety': 'Снизить тревожность',
      'improve-mood': 'Улучшить настроение',
      'boost-self-esteem': 'Повысить самооценку',
      'manage-stress': 'Справиться со стрессом',
      'better-sleep': 'Улучшить сон',
      'productivity': 'Повысить продуктивность',
      'mindfulness': 'Развить осознанность',
      'life-balance': 'Найти баланс в жизни',
      'relationships': 'Улучшить отношения',
      'self-care': 'Заботиться о себе',
      'habits': 'Развить полезные привычки',
      'thoughts': 'Работать с мыслями'
    };
    
    return (userData.goals || []).slice(0, 3).map((goal: string) => goalLabels[goal] || goal);
  };

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Добро пожаловать в PsyBalans, {userData.name || 'друг'}!
      </h2>
      
      <p className="text-gray-600 mb-8">Ваш персональный план готов</p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Краткая сводка</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Ваш тип:</span>
            <span className="font-medium">{getChronotypeLabel(userData.chronotype)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Основной фокус:</span>
            <span className="font-medium">{getTopGoals().join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Время для заботы:</span>
            <span className="font-medium">{userData.timeCommitment || '15-20'} минут</span>
          </div>
        </div>
      </div>
      
      <Card className="mb-8 border-emerald-200 bg-emerald-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-emerald-900 mb-2">
            Мы подготовили для вас первую активность
          </h3>
          <div className="text-emerald-800">
            <p className="font-medium">Дыхательная практика "5-4-3-2-1"</p>
            <p className="text-sm">5 минут • Снижение тревожности</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            onClick={() => console.log('Starting first activity...')}
          >
            Попробовать сейчас
          </Button>
        </CardContent>
      </Card>
      
      <div className="space-y-3">
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
          onClick={() => onNext({})}
        >
          Перейти в приложение
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-gray-600"
          onClick={() => onNext({})}
        >
          Сначала сделать первый чек-ин
        </Button>
      </div>
    </div>
  );
};

export default WelcomeComplete;
