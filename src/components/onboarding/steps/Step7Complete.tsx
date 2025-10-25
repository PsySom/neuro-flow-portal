import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CheckCircle, Sparkles, Book, Activity, Calendar, Bot, Settings } from 'lucide-react';
import { OnboardingData } from '../hooks/useOnboardingState';
import Confetti from 'react-confetti';

interface Step7CompleteProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onComplete: () => void;
}

const primaryGoals = [
  { id: 'mood', label: 'Улучшить настроение', icon: '😊', description: 'Стать более позитивным' },
  { id: 'sleep', label: 'Наладить сон', icon: '😴', description: 'Высыпаться и чувствовать бодрость' },
  { id: 'stress', label: 'Снизить стресс', icon: '😌', description: 'Меньше тревожиться' },
  { id: 'procrastination', label: 'Победить прокрастинацию', icon: '✅', description: 'Делать дела вовремя' },
  { id: 'mindfulness', label: 'Развить осознанность', icon: '🧘', description: 'Быть в моменте' },
  { id: 'energy', label: 'Повысить энергию', icon: '⚡', description: 'Чувствовать себя бодрее' },
];

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Step7Complete: React.FC<Step7CompleteProps> = ({ data, updateData, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Generate personalized diary recommendations
  const getDiaryRecommendations = (): Recommendation[] => {
    const diaries: Recommendation[] = [];
    
    if (data.primaryGoal === 'mood' || data.challenges.includes('mood-swings')) {
      diaries.push({
        icon: <Book className="w-5 h-5 text-blue-500" />,
        title: 'Дневник настроения',
        description: 'Отслеживайте перепады настроения и находите триггеры'
      });
    }
    
    if (data.primaryGoal === 'sleep' || data.challenges.includes('sleep-issues') || data.sleepQuality < 5) {
      diaries.push({
        icon: <Book className="w-5 h-5 text-purple-500" />,
        title: 'Дневник сна',
        description: 'Анализируйте качество сна и улучшайте режим'
      });
    }
    
    if (data.primaryGoal === 'procrastination' || data.challenges.includes('procrastination')) {
      diaries.push({
        icon: <Book className="w-5 h-5 text-orange-500" />,
        title: 'Дневник прокрастинации',
        description: 'Побеждайте откладывание дел на потом'
      });
    }

    // Default diary if none selected
    if (diaries.length === 0) {
      diaries.push({
        icon: <Book className="w-5 h-5 text-green-500" />,
        title: 'Дневник благодарности',
        description: 'Начните с позитивных практик'
      });
    }
    
    return diaries.slice(0, 3);
  };

  // Generate personalized practice recommendations
  const getPracticeRecommendations = (): Recommendation[] => {
    const practices: Recommendation[] = [];
    
    if (data.challenges.includes('anxiety') || data.challenges.includes('stress')) {
      practices.push({
        icon: <Activity className="w-5 h-5 text-blue-500" />,
        title: 'Дыхательные техники',
        description: '5 минут для снятия тревоги'
      });
    }
    
    if (data.chronotype === 'morning') {
      practices.push({
        icon: <Activity className="w-5 h-5 text-yellow-500" />,
        title: 'Утренняя медитация',
        description: 'Начните день с осознанности'
      });
    }
    
    if (data.chronotype === 'evening') {
      practices.push({
        icon: <Activity className="w-5 h-5 text-purple-500" />,
        title: 'Вечерняя релаксация',
        description: 'Подготовьтесь к качественному сну'
      });
    }
    
    if (data.primaryGoal === 'procrastination') {
      practices.push({
        icon: <Activity className="w-5 h-5 text-orange-500" />,
        title: 'Техники от прокрастинации',
        description: 'Pomodoro и другие методы'
      });
    }
    
    if (data.primaryGoal === 'mindfulness') {
      practices.push({
        icon: <Activity className="w-5 h-5 text-green-500" />,
        title: 'Упражнения осознанности',
        description: 'Будьте здесь и сейчас'
      });
    }

    // Add body scan if low energy
    if (data.energy === 'very-low' || data.energy === 'low') {
      practices.push({
        icon: <Activity className="w-5 h-5 text-pink-500" />,
        title: 'Сканирование тела',
        description: 'Восстановите энергию'
      });
    }
    
    return practices.slice(0, 5);
  };

  // Generate personalized schedule
  const getScheduleRecommendations = (): Recommendation[] => {
    const schedule: Recommendation[] = [];
    
    // Morning scenario
    if (data.wakeTime) {
      const wakeHour = parseInt(data.wakeTime.split(':')[0]);
      const morningTime = `${wakeHour}:${data.wakeTime.split(':')[1]}`;
      schedule.push({
        icon: <Calendar className="w-5 h-5 text-yellow-500" />,
        title: `Утренний сценарий в ${morningTime}`,
        description: 'Практики для бодрого начала дня'
      });
    }
    
    // Midday check
    schedule.push({
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      title: 'Дневная проверка в 14:00',
      description: 'Быстрая оценка состояния'
    });
    
    // Evening scenario
    if (data.bedTime) {
      const bedHour = parseInt(data.bedTime.split(':')[0]);
      const eveningTime = bedHour >= 2 ? `${bedHour - 1}:00` : '21:00';
      schedule.push({
        icon: <Calendar className="w-5 h-5 text-purple-500" />,
        title: `Вечерний сценарий в ${eveningTime}`,
        description: 'Подготовка к качественному сну'
      });
    }
    
    return schedule;
  };

  const diaryRecommendations = getDiaryRecommendations();
  const practiceRecommendations = getPracticeRecommendations();
  const scheduleRecommendations = getScheduleRecommendations();

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">
          Последний шаг!
        </h1>
        <p className="text-lg text-muted-foreground">
          Что привело вас в PsyBalance?
        </p>
      </div>

      {/* Primary Goal Selection */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-base font-semibold">
            Выберите главную цель:
          </Label>
          <div className="space-y-3">
            {primaryGoals.map((goal) => (
              <div
                key={goal.id}
                className={`
                  flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                  ${data.primaryGoal === goal.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
                onClick={() => updateData({ primaryGoal: goal.id })}
              >
                <span className="text-2xl">{goal.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{goal.label}</p>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.primaryGoal && (
        <>
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">
              ✨ Ваш персональный план готов!
            </h2>
            <p className="text-lg text-muted-foreground">
              Отлично, {data.name}! На основе ваших ответов мы подобрали:
            </p>
          </div>

          <div className="space-y-6">
            {/* Recommended Diaries */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                📊 Рекомендованные дневники:
              </h3>
              <div className="space-y-3">
                {diaryRecommendations.map((diary, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {diary.icon}
                    <div className="flex-1">
                      <p className="font-medium">{diary.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {diary.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Practices */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                🧘 Практики для начала:
              </h3>
              <div className="space-y-3">
                {practiceRecommendations.map((practice, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {practice.icon}
                    <div className="flex-1">
                      <p className="font-medium">{practice.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Schedule */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                📅 Персональное расписание:
              </h3>
              <div className="space-y-3">
                {scheduleRecommendations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {item.icon}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  💬 AI-ассистент настроен под ваш стиль
                </h3>
                <p className="text-sm text-muted-foreground">
                  Мы учли ваш ритм жизни, хронотип и предпочтения.
                  Ассистент будет адаптироваться под ваши потребности.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Call to Action */}
          <Button
        size="lg"
        onClick={onComplete}
        className="w-full"
      >
            <Sparkles className="w-5 h-5 mr-2" />
            Начать использовать
          </Button>

          {/* Additional Info */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground/80">
                  <p className="font-medium mb-2">💡 Вы сможете настроить детали в профиле:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Детали сна и режим</li>
                    <li>• Профессиональную помощь</li>
                    <li>• Социальную поддержку</li>
                    <li>• Стиль обратной связи</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Step7Complete;
