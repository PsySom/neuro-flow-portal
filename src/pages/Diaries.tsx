
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Heart, MessageCircle, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';

const Diaries = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
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
              
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  К панели управления
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Дневники самонаблюдения
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Инструменты для развития самосознания и эмоционального интеллекта
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mood Diary */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <CardTitle>Дневник настроения</CardTitle>
                </div>
                <CardDescription>
                  Отслеживайте свои эмоции и настроение в течение дня
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/diaries/mood">
                  <Button className="w-full">Открыть дневник</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Thoughts Diary */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <CardTitle>Дневник мыслей</CardTitle>
                </div>
                <CardDescription>
                  Анализируйте свои мысли и когнитивные паттерны
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/diaries/thoughts">
                  <Button className="w-full">Открыть дневник</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Procrastination Diary */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <CardTitle>Дневник прокрастинации</CardTitle>
                </div>
                <CardDescription>
                  Изучайте причины откладывания дел и развивайте стратегии преодоления
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/diaries/procrastination">
                  <Button className="w-full">Открыть дневник</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Как использовать дневники?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">1. Регулярность</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Заполняйте дневники ежедневно для лучшего понимания своих паттернов
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">2. Честность</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Будьте открыты и честны с собой при заполнении записей
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">3. Анализ</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Периодически просматривайте свои записи для выявления закономерностей
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diaries;
