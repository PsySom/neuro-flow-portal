
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Clock, Heart, Target, Calendar } from 'lucide-react';

interface FirstCheckinProps {
  userData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const FirstCheckin: React.FC<FirstCheckinProps> = ({ userData, onNext, onBack }) => {
  const getMoodEmoji = (value: number) => {
    if (value <= -3) return '😔';
    if (value <= -1) return '😕';
    if (value <= 1) return '😐';
    if (value <= 3) return '🙂';
    return '😄';
  };

  const getChronotypeEmoji = (chronotype: string) => {
    switch (chronotype) {
      case 'lark': return '🌅';
      case 'owl': return '🌙';
      case 'normal': return '☀️';
      case 'shift': return '🔄';
      default: return '☀️';
    }
  };

  const getChronotypeLabel = (chronotype: string) => {
    switch (chronotype) {
      case 'lark': return 'Жаворонок';
      case 'owl': return 'Сова';
      case 'normal': return 'Обычный ритм';
      case 'shift': return 'Сменный график';
      default: return 'Обычный ритм';
    }
  };

  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTopChallenges = () => {
    if (!userData.challenges || userData.challenges.length === 0) return 'Не указаны';
    return userData.challenges.slice(0, 3).join(', ');
  };

  const getTopGoals = () => {
    if (!userData.goals || userData.goals.length === 0) return 'Не указаны';
    const goalLabels = {
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
    return userData.goals.slice(0, 3).map((goal: string) => goalLabels[goal] || goal).join(', ');
  };

  const handleComplete = () => {
    onNext({
      checkinCompleted: true,
      checkinDate: new Date().toISOString()
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={100} className="mb-4" />
        <p className="text-sm text-gray-500">Финальная проверка</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Давайте зафиксируем ваше текущее состояние
        </h2>
        <p className="text-gray-600">
          Вот сводка ваших ответов для создания персонального плана
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Основная информация */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <User className="w-5 h-5 mr-2 text-emerald-600" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Имя:</span>
              <span className="font-medium">{userData.name || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Возраст:</span>
              <span className="font-medium">{userData.age?.[0] || 'Не указан'} лет</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Хронотип:</span>
              <span className="font-medium">
                {getChronotypeEmoji(userData.chronotype)} {getChronotypeLabel(userData.chronotype)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Режим дня */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Режим дня
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Пробуждение:</span>
              <span className="font-medium">{formatTime(userData.wakeTime || 7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Отход ко сну:</span>
              <span className="font-medium">{formatTime(userData.sleepTime || 23)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Текущее состояние */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Текущее состояние
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Настроение:</span>
              <span className="font-medium">
                {getMoodEmoji(userData.mood || 0)} ({userData.mood > 0 ? '+' : ''}{userData.mood || 0})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Энергия:</span>
              <span className="font-medium">{userData.energy || 'Не указана'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Качество сна:</span>
              <span className="font-medium">{userData.sleep || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Уровень стресса:</span>
              <span className="font-medium">{userData.stress || 'Не указан'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Основные вызовы */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Основные вызовы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{getTopChallenges()}</p>
          </CardContent>
        </Card>

        {/* Цели */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Главные цели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{getTopGoals()}</p>
          </CardContent>
        </Card>

        {/* Предпочтения */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-teal-600" />
              Предпочтения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Время для заботы:</span>
              <span className="font-medium">{userData.timeCommitment || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Напоминания:</span>
              <span className="font-medium">{userData.reminderFrequency || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Структурированность:</span>
              <span className="font-medium">{userData.structurePreference || 'Не указано'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-emerald-800">
          <strong>Отлично!</strong> На основе ваших ответов мы создали персональный план. 
          Теперь вы готовы начать свой путь к лучшему самочувствию.
        </p>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          Завершить настройку
        </Button>
      </div>
    </div>
  );
};

export default FirstCheckin;
