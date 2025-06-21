
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Search, 
  Calendar, 
  Activity, 
  Target, 
  Zap,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/dashboard/UserMenu';
import AIChatComponent from '@/components/dashboard/AIChatComponent';
import ActivityTimelineComponent from '@/components/dashboard/ActivityTimelineComponent';
import BalanceWheelComponent from '@/components/dashboard/BalanceWheelComponent';
import QuickStatsComponent from '@/components/dashboard/QuickStatsComponent';
import RecommendationsComponent from '@/components/dashboard/RecommendationsComponent';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'Пользователь';

  // Auto-scroll to greeting section when navigating to dashboard
  useEffect(() => {
    const greetingElement = document.getElementById('dashboard-greeting');
    if (greetingElement) {
      greetingElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
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

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/diaries">
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  style={{ color: `hsl(var(--psybalans-primary))` }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Дневники
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="ghost" className="dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Календарь
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="dark:text-gray-300"
                onClick={() => navigate('/practices')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Упражнения
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Поиск..." 
                  className="pl-10 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <div id="dashboard-greeting" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Как дела? Готовы поработать над своим внутренним балансом?
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - AI Chat (40%) */}
          <div className="lg:col-span-2">
            <AIChatComponent />
          </div>

          {/* Right Column - Activity Timeline (60%) */}
          <div className="lg:col-span-3">
            <ActivityTimelineComponent />
          </div>

          {/* Balance Wheel - Full Width Below */}
          <div className="lg:col-span-5">
            <BalanceWheelComponent />
          </div>

          {/* Quick Stats and Recommendations - Full Width Below */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-1">
                <QuickStatsComponent />
              </div>

              {/* Recommendations */}
              <div className="lg:col-span-2">
                <RecommendationsComponent />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Состояние */}
            <Button 
              variant="ghost" 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
              onClick={() => console.log('Navigate to Состояние')}
            >
              <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Состояние</span>
            </Button>

            {/* Рекомендации */}
            <Button 
              variant="ghost" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border"
              style={{
                background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))`,
                borderColor: `hsl(var(--psybalans-primary) / 0.2)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, hsl(var(--psybalans-primary) / 0.2), hsl(var(--psybalans-secondary) / 0.2))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to bottom right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))`;
              }}
              onClick={() => console.log('Navigate to Рекомендации')}
            >
              <Target className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
              <span className="text-sm font-medium" style={{ color: `hsl(var(--psybalans-primary))` }}>Рекомендации</span>
            </Button>

            {/* Статистика */}
            <Button 
              variant="ghost" 
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
              onClick={() => console.log('Navigate to Статистика')}
            >
              <div className="w-8 h-8 bg-purple-600 dark:bg-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-purple-900 text-xs font-bold">📊</span>
              </div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Статистика</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
