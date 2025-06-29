
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Zap, LayoutDashboard } from 'lucide-react';

const AdaptiveNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/dashboard',
      label: 'Дашборд',
      icon: LayoutDashboard
    },
    {
      path: '/diaries',
      label: 'Дневники',
      icon: BookOpen
    },
    {
      path: '/calendar',
      label: 'Календарь',
      icon: Calendar
    },
    {
      path: '/practices',
      label: 'Упражнения',
      icon: Zap
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-3">
          <div className="flex space-x-2 sm:space-x-4 md:space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm ${
                      isActive(item.path)
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium hidden xs:inline sm:inline">{item.label}</span>
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
