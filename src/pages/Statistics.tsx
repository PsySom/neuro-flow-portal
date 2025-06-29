
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodEmotionsChart from '@/components/statistics/MoodEmotionsChart';

const Statistics = () => {
  useEffect(() => {
    console.log('Statistics page mounted successfully - route /statistics');
    console.log('Current location:', window.location.pathname);
  }, []);

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
                  К дашборду
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Статистика
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Анализ данных из ваших дневников
          </p>
        </div>

        <Tabs defaultValue="mood-emotions" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mood-emotions">Настроение и эмоции</TabsTrigger>
            <TabsTrigger value="thoughts">Мысли</TabsTrigger>
            <TabsTrigger value="self-esteem">Самооценка</TabsTrigger>
            <TabsTrigger value="procrastination">Прокрастинация</TabsTrigger>
            <TabsTrigger value="ocd">ОКР</TabsTrigger>
          </TabsList>

          <TabsContent value="mood-emotions" className="mt-6">
            <MoodEmotionsChart />
          </TabsContent>

          <TabsContent value="thoughts" className="mt-6">
            <div className="text-center py-12 text-gray-500">
              График мыслей будет добавлен позднее
            </div>
          </TabsContent>

          <TabsContent value="self-esteem" className="mt-6">
            <div className="text-center py-12 text-gray-500">
              График самооценки будет добавлен позднее
            </div>
          </TabsContent>

          <TabsContent value="procrastination" className="mt-6">
            <div className="text-center py-12 text-gray-500">
              График прокрастинации будет добавлен позднее  
            </div>
          </TabsContent>

          <TabsContent value="ocd" className="mt-6">
            <div className="text-center py-12 text-gray-500">
              График ОКР будет добавлен позднее
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Statistics;
