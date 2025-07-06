import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Clock, Heart, Target, Settings, Users } from 'lucide-react';

interface ConfirmationScreenProps {
  userData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ userData, onNext, onBack }) => {
  const getMoodEmoji = (value: number) => {
    if (value <= 3) return '😔';
    if (value <= 5) return '😐';
    if (value <= 7) return '🙂';
    return '😄';
  };

  const getActiveTimeLabel = (time: string) => {
    switch (time) {
      case 'morning': return '🌅 Утром';
      case 'day': return '🌞 Днем';
      case 'evening': return '🌙 Вечером';
      case 'varies': return '🔄 По-разному';
      default: return 'Не указано';
    }
  };

  const formatTime = (hour: number) => {
    if (hour > 24) hour -= 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTopChallenges = () => {
    if (!userData.challenges || userData.challenges.length === 0) return 'Не указаны';
    return userData.challenges.slice(0, 3).join(', ');
  };

  const getTopGoals = () => {
    if (!userData.goals || userData.goals.length === 0) return 'Не указаны';
    const goalLabels = {
      'reduce-anxiety': 'Справляться с тревогой',
      'improve-mood': 'Поддерживать хорошее настроение',
      'boost-self-esteem': 'Нормализовать самооценку',
      'manage-stress': 'Управлять стрессом',
      'better-sleep': 'Нормализовать сон',
      'productivity': 'Повысить продуктивность',
      'mindfulness': 'Развить осознанность',
      'life-balance': 'Найти баланс',
      'relationships': 'Улучшить отношения',
      'self-care': 'Заботиться о себе',
      'habits': 'Выработать полезные привычки',
      'thoughts': 'Работать с мыслями и эмоциями',
      'self-acceptance': 'Принимать себя',
      'bad-habits': 'Справиться с вредными привычками'
    };
    return userData.goals.slice(0, 3).map((goal: string) => goalLabels[goal] || goal).join(', ');
  };

  const handleComplete = () => {
    onNext({
      confirmationCompleted: true,
      completionDate: new Date().toISOString()
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={100} className="mb-4" />
        <p className="text-sm text-gray-500">Подтверждение и запуск</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Готовы начать ваш путь к балансу?
        </h2>
        <p className="text-gray-600">
          Проверьте ваши настройки перед созданием персонального плана
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
              <span className="text-gray-600">Активность:</span>
              <span className="font-medium">{getActiveTimeLabel(userData.activeTime)}</span>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Качество сна:</span>
              <span className="font-medium">{userData.sleepQuality || 'Не указано'}</span>
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
                {getMoodEmoji(userData.mood || 5)} {userData.mood || 5}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Энергия:</span>
              <span className="font-medium">{userData.energy || 'Не указана'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Стресс:</span>
              <span className="font-medium">{userData.stressLevel || 'Не указан'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Основные цели */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
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
              <Settings className="w-5 h-5 mr-2 text-teal-600" />
              Предпочтения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Время для практик:</span>
              <span className="font-medium">{userData.timeCommitment || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Напоминания:</span>
              <span className="font-medium">{userData.reminderFrequency || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Стиль поддержки:</span>
              <span className="font-medium">{userData.supportStyle || 'Не указан'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Социальная поддержка */}
        {userData.relationshipsQuality && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Социальные связи
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Качество отношений:</span>
                <span className="font-medium">{userData.relationshipsQuality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Частота одиночества:</span>
                <span className="font-medium">{userData.lonelinessFrequency}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-emerald-900 mb-2">
          🌈 Спасибо за открытость!
        </h3>
        <p className="text-sm text-emerald-800">
          Благодарим за время, потраченное на заполнение анкеты. Теперь мы можем создать для вас 
          персональную программу поддержки, которая будет расти и развиваться вместе с вами.
        </p>
        <p className="text-sm text-emerald-800 mt-2">
          <strong>Помните:</strong> забота о себе — это не роскошь, а необходимость. 
          Мы здесь, чтобы поддержать вас на этом пути. 💚
        </p>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Хочу что-то изменить
        </Button>
        <Button 
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          Создать мой личный план
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;