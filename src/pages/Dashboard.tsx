
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
import AIChatComponent from '@/components/dashboard/AIChatComponent';
import ActivityTimelineComponent from '@/components/dashboard/ActivityTimelineComponent';
import BalanceWheelComponent from '@/components/dashboard/BalanceWheelComponent';
import QuickStatsComponent from '@/components/dashboard/QuickStatsComponent';
import RecommendationsComponent from '@/components/dashboard/RecommendationsComponent';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-emerald-600 font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Дневники
              </Button>
              <Button variant="ghost">
                <Calendar className="w-4 h-4 mr-2" />
                Календарь
              </Button>
              <Button variant="ghost">
                <Activity className="w-4 h-4 mr-2" />
                Состояние
              </Button>
              <Button variant="ghost">
                <Target className="w-4 h-4 mr-2" />
                Рекомендации
              </Button>
              <Button variant="ghost">
                <Zap className="w-4 h-4 mr-2" />
                Упражнения
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Поиск..." 
                  className="pl-10 w-64"
                />
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-emerald-100 text-emerald-600">АП</AvatarFallback>
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
    </div>
  );
};

export default Dashboard;
