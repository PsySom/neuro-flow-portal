
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Zap, LayoutDashboard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AdaptiveNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      path: '/dashboard',
      label: 'Дашборд',
      emoji: '📊',
      icon: LayoutDashboard
    },
    {
      path: '/diaries',
      label: 'Дневники',
      emoji: '📝',
      icon: BookOpen
    },
    {
      path: '/calendar',
      label: 'Календарь',
      emoji: '📅',
      icon: Calendar
    },
    {
      path: '/practices',
      label: 'Практики',
      emoji: '⚡',
      icon: Zap
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    // Мобильная версия с эмодзи
    return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-16 z-40">
        <div className="flex justify-center items-center py-3 px-4">
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className={`text-3xl p-3 h-auto ${
                    isActive(item.path) 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.emoji}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Планшетная версия с текстом и иконками
  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-16 z-40 md:block hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center space-x-2 px-4 py-2 ${
                      isActive(item.path)
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdaptiveNavigation;
