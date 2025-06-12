
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  Search, 
  Calendar, 
  Activity, 
  Target, 
  Zap,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import AIChatComponent from '@/components/dashboard/AIChatComponent';
import ActivityTimelineComponent from '@/components/dashboard/ActivityTimelineComponent';
import BalanceWheelComponent from '@/components/dashboard/BalanceWheelComponent';
import QuickStatsComponent from '@/components/dashboard/QuickStatsComponent';
import RecommendationsComponent from '@/components/dashboard/RecommendationsComponent';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-24">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-emerald-600 dark:text-emerald-400 font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Дневники
              </Button>
              <Button variant="ghost" className="dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                Календарь
              </Button>
              <Button variant="ghost" className="dark:text-gray-300">
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
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">АП</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

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
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/30 dark:hover:to-emerald-700/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
              onClick={() => console.log('Navigate to Рекомендации')}
            >
              <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Рекомендации</span>
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
