
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SettingsButton } from '@/components/SettingsButton';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import CreateActivityDialog from '@/components/calendar/components/CreateActivityDialog';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useAuth } from '@/contexts/AuthContext';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('day');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { addActivity, updateActivity, deleteActivity } = useActivities();
  const { user } = useAuth();

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (activeTab === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (activeTab === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (activeTab === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const getDateTitle = () => {
    const options: Intl.DateTimeFormatOptions = {};
    
    if (activeTab === 'day') {
      options.weekday = 'long';
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
    } else if (activeTab === 'week') {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else if (activeTab === 'month') {
      options.year = 'numeric';
      options.month = 'long';
    }
    
    return currentDate.toLocaleDateString('ru-RU', options);
  };

  const handleActivityCreate = (activity: any) => {
    addActivity(activity);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Логотип слева */}
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

              {/* Центральная навигация */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/diaries">
                  <Button variant="ghost" className="dark:text-gray-300">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Дневники
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" className="dark:text-gray-300">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Дашборд
                  </Button>
                </Link>
                <Link to="/practices">
                  <Button variant="ghost" className="dark:text-gray-300">
                    <Zap className="w-4 h-4 mr-2" />
                    Упражнения
                  </Button>
                </Link>
              </nav>

              {/* Правая часть */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input 
                    placeholder="Поиск..." 
                    className="pl-10 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
                <ThemeToggle />
                <Avatar>
                  <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Calendar Header */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getDateTitle()}
                </h1>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Сегодня
                </Button>
              </div>
              
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать активность
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="day">День</TabsTrigger>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
            </TabsList>
            
            <TabsContent value="day" className="mt-0">
              <DayView 
                currentDate={currentDate} 
                onUpdateActivity={updateActivity}
                onDeleteActivity={deleteActivity}
              />
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              <WeekView currentDate={currentDate} />
            </TabsContent>
            
            <TabsContent value="month" className="mt-0">
              <MonthView currentDate={currentDate} />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default Calendar;
