
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Activity, ActivitySquare, Moon, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import MoodEmotionsChart from '@/components/statistics/MoodEmotionsChart';
import SleepChart from '@/components/statistics/SleepChart';
import { useDiaryStatus } from '@/contexts/DiaryStatusContext';

const Statistics = () => {
  const { activeDiaries } = useDiaryStatus();

  useEffect(() => {
    console.log('=== STATISTICS PAGE MOUNTED ===');
    console.log('Route: /statistics');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('Document title:', document.title);
    console.log('=== END STATISTICS DEBUG ===');
  }, []);

  // Функция для определения активности дневника
  const isDiaryActive = (path: string) => {
    const activeDiary = activeDiaries.find(diary => diary.path === path);
    return activeDiary ? activeDiary.isActive : false;
  };

  const chartTabs = [
    {
      id: 'mood-emotions',
      label: 'Настроение и эмоции',
      icon: Activity,
      path: '/mood-diary',
      component: <MoodEmotionsChart />
    },
    {
      id: 'sleep',
      label: 'Сон и отдых',
      icon: Moon,
      path: '/sleep-diary',
      component: <SleepChart />
    },
    {
      id: 'thoughts',
      label: 'Мысли',
      icon: Brain,
      path: '/thoughts-diary',
      component: <div className="text-center py-12 text-gray-500">График мыслей будет добавлен позднее</div>
    },
    {
      id: 'self-esteem',
      label: 'Самооценка',
      icon: CheckCircle,
      path: '/self-esteem-diary',
      component: <div className="text-center py-12 text-gray-500">График самооценки будет добавлен позднее</div>
    },
    {
      id: 'procrastination',
      label: 'Прокрастинация',
      icon: XCircle,
      path: '/procrastination-diary',
      component: <div className="text-center py-12 text-gray-500">График прокрастинации будет добавлен позднее</div>
    },
    {
      id: 'ocd',
      label: 'ОКР',
      icon: ActivitySquare,
      path: '/ocd-diary',
      component: <div className="text-center py-12 text-gray-500">График ОКР будет добавлен позднее</div>
    }
  ];

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
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              ✅ Страница статистики успешно загружена!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar с вкладками графиков */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-2">
                 <Tabs defaultValue="mood-emotions" className="w-full" orientation="vertical">
                   <TabsList className="grid w-full grid-rows-6 h-auto bg-transparent p-0 gap-1">
                     {chartTabs.map((tab) => {
                       const isActive = isDiaryActive(tab.path);
                       const hasData = activeDiaries.find(diary => diary.path === tab.path) !== undefined;
                       const Icon = tab.icon;
                       
                       return (
                         <TabsTrigger 
                           key={tab.id}
                           value={tab.id} 
                           className="w-full justify-start h-auto p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                         >
                           <div className="flex items-center gap-3 w-full">
                             <div className="flex items-center gap-2">
                               <Icon className="w-4 h-4" />
                               <span className="text-sm font-medium">{tab.label}</span>
                             </div>
                             <div className="ml-auto flex items-center gap-1">
                               {isActive ? (
                                 <div className="flex items-center gap-1">
                                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                   <span className="text-xs text-green-600 dark:text-green-400">Активен</span>
                                 </div>
                               ) : hasData ? (
                                 <div className="flex items-center gap-1">
                                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                   <span className="text-xs text-yellow-600 dark:text-yellow-400">Пауза</span>
                                 </div>
                               ) : (
                                 <div className="flex items-center gap-1">
                                   <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                   <span className="text-xs text-gray-500">Неактивен</span>
                                 </div>
                               )}
                             </div>
                           </div>
                         </TabsTrigger>
                       );
                     })}
                  </TabsList>

                   {/* Контент графиков */}
                   <div className="lg:hidden mt-4">
                     {chartTabs.map((tab) => {
                       const isActive = isDiaryActive(tab.path);
                       
                       return (
                         <TabsContent key={tab.id} value={tab.id} className="mt-0">
                           <div className="mb-4 p-3 rounded-lg bg-muted/30">
                             <div className="flex items-center gap-2">
                               <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                               <span className="text-sm font-medium">
                                 Дневник {isActive ? 'активен' : 'неактивен'}
                               </span>
                               {!isActive && (
                                 <span className="text-xs text-muted-foreground">
                                   (график заморожен на последней записи)
                                 </span>
                               )}
                             </div>
                           </div>
                           {tab.component}
                         </TabsContent>
                       );
                     })}
                   </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Основной контент графиков (только на больших экранах) */}
          <div className="hidden lg:block lg:col-span-3">
            <Tabs defaultValue="mood-emotions" className="w-full">
               {chartTabs.map((tab) => {
                 const isActive = isDiaryActive(tab.path);
                 
                 return (
                   <TabsContent key={tab.id} value={tab.id} className="mt-0">
                     <div className="mb-4 p-3 rounded-lg bg-muted/30">
                       <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                         <span className="text-sm font-medium">
                           Дневник {isActive ? 'активен' : 'неактивен'}
                         </span>
                         {!isActive && (
                           <span className="text-xs text-muted-foreground">
                             (график заморожен на последней записи)
                           </span>
                         )}
                       </div>
                     </div>
                     {tab.component}
                   </TabsContent>
                 );
               })}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
