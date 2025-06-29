
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Target, BarChart3 } from 'lucide-react';

const DashboardBottomNav = () => {
  const navigate = useNavigate();

  const handleStateClick = () => {
    console.log('Navigate to Состояние');
    // TODO: Создать страницу состояния
    navigate('/state');
  };

  const handleRecommendationsClick = () => {
    console.log('Navigate to Рекомендации');
    // TODO: Создать страницу рекомендаций
    navigate('/recommendations');
  };

  const handleStatisticsClick = () => {
    console.log('Navigate to Статистика');
    navigate('/statistics');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Состояние */}
          <Button 
            variant="ghost" 
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
            onClick={handleStateClick}
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
            onClick={handleRecommendationsClick}
          >
            <Target className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
            <span className="text-sm font-medium" style={{ color: `hsl(var(--psybalans-primary))` }}>Рекомендации</span>
          </Button>

          {/* Статистика */}
          <Button 
            variant="ghost" 
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
            onClick={handleStatisticsClick}
          >
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Статистика</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardBottomNav;
