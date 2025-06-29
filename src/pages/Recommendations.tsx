
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';

const Recommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            Рекомендации
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Персонализированные рекомендации для улучшения психологического состояния
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{
                   background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary) / 0.2), hsl(var(--psybalans-secondary) / 0.2))`
                 }}>
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Страница в разработке
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Здесь будут персонализированные рекомендации на основе ваших данных
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
