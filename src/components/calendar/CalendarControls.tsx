
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface CalendarControlsProps {
  dateTitle: string;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onToday: () => void;
  onCreateActivity: () => void;
}

const CalendarControls: React.FC<CalendarControlsProps> = ({
  dateTitle,
  onNavigatePrev,
  onNavigateNext,
  onToday,
  onCreateActivity
}) => {
  const { settings } = usePersonalization();

  const getAccentColorClasses = () => {
    switch (settings?.accentColor) {
      case 'lavender-gold':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'sky-apricot':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'mint-plum':
        return 'bg-teal-600 hover:bg-teal-700';
      case 'rose-indigo':
        return 'bg-pink-600 hover:bg-pink-700';
      case 'ice-neon':
        return 'bg-cyan-600 hover:bg-cyan-700';
      case 'sage-coral':
      default:
        return 'bg-emerald-600 hover:bg-emerald-700';
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={onNavigatePrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {dateTitle}
            </h1>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={onNavigateNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={onToday}
            >
              Сегодня
            </Button>
          </div>
          
          <Button 
            className={getAccentColorClasses()}
            onClick={onCreateActivity}
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать активность
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarControls;
