
import React from 'react';
import { Brain, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/dashboard/UserMenu';

const CalendarHeader = () => {
  const { isAuthenticated } = useAuth();

  return (
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

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input 
                placeholder="Поиск..." 
                className="pl-10 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <ThemeToggle />
            {isAuthenticated && <UserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
