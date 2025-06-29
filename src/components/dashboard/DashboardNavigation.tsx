
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Zap, BarChart3 } from 'lucide-react';

const DashboardNavigation = () => {
  const navigate = useNavigate();

  const handleStatisticsClick = () => {
    console.log('Navigating to statistics...');
    navigate('/statistics');
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
      <Button variant="ghost" className="dark:text-gray-300" onClick={handleStatisticsClick}>
        <BarChart3 className="w-4 h-4 mr-2" />
        Статистика
      </Button>
    </nav>
  );
};

export default DashboardNavigation;
