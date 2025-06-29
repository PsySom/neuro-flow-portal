
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Zap, BarChart3 } from 'lucide-react';

const DashboardNavigation = () => {
  const location = useLocation();

  const handleStatisticsClick = (e: React.MouseEvent) => {
    console.log('Statistics button clicked');
    console.log('Current location:', location.pathname);
    console.log('Target: /statistics');
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/diaries">
        <Button variant="ghost" className="dark:text-gray-300">
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
      <Link to="/practices">
        <Button variant="ghost" className="dark:text-gray-300">
          <Zap className="w-4 h-4 mr-2" />
          Упражнения
        </Button>
      </Link>
      <Link to="/statistics" onClick={handleStatisticsClick}>
        <Button variant="ghost" className="dark:text-gray-300">
          <BarChart3 className="w-4 h-4 mr-2" />
          Статистика
        </Button>
      </Link>
    </nav>
  );
};

export default DashboardNavigation;
