
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, BookOpen, Zap } from 'lucide-react';

const CalendarNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/dashboard">
        <Button variant="ghost" className="dark:text-gray-300">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Дашборд
        </Button>
      </Link>
      <Link to="/diaries">
        <Button variant="ghost" className="dark:text-gray-300">
          <BookOpen className="w-4 h-4 mr-2" />
          Дневники
        </Button>
      </Link>
      <Link to="/practices">
        <Button variant="ghost" className="dark:text-gray-300">
          <Zap className="w-4 h-4 mr-2" />
          Упражнения
        </Button>
      </Link>
    </nav>
  );
};

export default CalendarNavigation;
