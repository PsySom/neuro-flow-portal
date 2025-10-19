
import React from 'react';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';
import AdaptiveNavigation from '@/components/navigation/AdaptiveNavigation';
import DiaryStatusManager from '@/components/diaries/DiaryStatusManager';

const diaryTypes = [
  {
    title: 'Дневник настроения (сценарий)',
    description: 'Структурированный дневник с пошаговыми вопросами',
    emoji: '😊',
    path: '/mood-scenario-diary',
    color: 'from-pink-100 to-pink-200',
    darkColor: 'dark:from-pink-900/20 dark:to-pink-800/20',
    isNew: true
  },
  {
    title: 'Дневник настроения',
    description: 'Отслеживайте свои эмоции и настроение',
    emoji: '😊',
    path: '/mood-diary',
    color: 'from-pink-100 to-pink-200',
    darkColor: 'dark:from-pink-900/20 dark:to-pink-800/20'
  },
  {
    title: 'Дневник мыслей',
    description: 'Анализируйте и переосмысливайте свои мысли',
    emoji: '💭',
    path: '/thoughts-diary',
    color: 'from-blue-100 to-blue-200',
    darkColor: 'dark:from-blue-900/20 dark:to-blue-800/20'
  },
  {
    title: 'Дневник самооценки',
    description: 'Укрепляйте уверенность в себе',
    emoji: '✨',
    path: '/self-esteem-diary',
    color: 'from-emerald-100 to-emerald-200',
    darkColor: 'dark:from-emerald-900/20 dark:to-emerald-800/20'
  },
  {
    title: 'Дневник работы с прокрастинацией',
    description: 'Преодолевайте откладывание дел',
    emoji: '⏰',
    path: '/procrastination-diary',
    color: 'from-orange-100 to-orange-200',
    darkColor: 'dark:from-orange-900/20 dark:to-orange-800/20'
  },
  {
    title: 'Дневник работы с ОКР',
    description: 'Работа с обсессивно-компульсивными расстройствами',
    emoji: '🔄',
    path: '/ocd-diary',
    color: 'from-purple-100 to-purple-200',
    darkColor: 'dark:from-purple-900/20 dark:to-purple-800/20'
  },
  {
    title: 'Дневник работы с депрессией',
    description: 'Поддержка в работе с депрессивными состояниями',
    emoji: '🌱',
    path: '/depression-care-diary',
    color: 'from-green-100 to-green-200',
    darkColor: 'dark:from-green-900/20 dark:to-green-800/20'
  },
  {
    title: 'Дневник сна и отдыха',
    description: 'Отслеживайте качество сна и восстановления',
    emoji: '😴',
    path: '/sleep-diary',
    color: 'from-indigo-100 to-indigo-200',
    darkColor: 'dark:from-indigo-900/20 dark:to-indigo-800/20'
  }
];

const Diaries = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
              <span 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                }}
              >
                PsyBalans
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <AdaptiveNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Психологические дневники
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Выберите подходящий дневник для работы с конкретными психологическими задачами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diaryTypes.map((diary) => (
            <Card key={diary.path} className={`bg-gradient-to-br ${diary.color} ${diary.darkColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative`}>
              {diary.isNew && (
                <div className="absolute top-3 right-3">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    НОВОЕ
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{diary.emoji}</div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {diary.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {diary.description}
                </p>
                
                <Link to={diary.path}>
                  <Button 
                    className="w-full text-white mb-3"
                    style={{ 
                      background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                    }}
                  >
                    Открыть дневник
                  </Button>
                </Link>

                {/* Компонент управления статусом дневника */}
                <DiaryStatusManager
                  diaryPath={diary.path}
                  title={diary.title}
                  emoji={diary.emoji}
                  description={diary.description}
                  color={diary.color}
                  onStatusChange={(status) => {
                    console.log(`Статус дневника ${diary.title} изменен:`, status);
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Diaries;
