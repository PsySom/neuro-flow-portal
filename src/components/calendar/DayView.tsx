
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { calculateActivityLayouts, generateTimeMarkers } from './utils/timeUtils';
import TimeMarkers from './components/TimeMarkers';
import ActivityCard from './components/ActivityCard';
import CurrentTimeIndicator from './components/CurrentTimeIndicator';
import CreateActivityDialog from './components/CreateActivityDialog';
import { baseActivities } from './data/activitiesData';
import { Activity } from './types';

interface DayViewProps {
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const [activities, setActivities] = useState<Activity[]>(baseActivities);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Фильтруем активности по выбранным типам
  const visibleActivities = activities.filter(activity => 
    !filteredTypes.has(activity.type)
  );

  const activityLayouts = calculateActivityLayouts(visibleActivities);
  const timeMarkers = generateTimeMarkers();

  // Получаем уникальные типы активностей
  const activityTypes = Array.from(new Set(activities.map(activity => activity.type)));

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    const hourFromTop = Math.floor(clickY / 60);
    const minuteFromTop = Math.floor((clickY % 60));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: Activity) => {
    setActivities(prev => [...prev, newActivity]);
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
    setFilteredTypes(prev => {
      const newFiltered = new Set(prev);
      if (checked) {
        newFiltered.delete(type);
      } else {
        newFiltered.add(type);
      }
      return newFiltered;
    });
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'восстановление': return 'Восстанавливающие';
      case 'нейтральная': return 'Нейтральные';
      case 'смешанная': return 'Смешанные';
      case 'задача': return 'Истощающие';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'восстановление': return 'bg-green-100 text-green-800';
      case 'нейтральная': return 'bg-gray-100 text-gray-800';
      case 'смешанная': return 'bg-yellow-100 text-yellow-800';
      case 'задача': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <div className="flex gap-6">
        {/* Левая панель с календарем и фильтрами */}
        <div className="w-80 space-y-4">
          {/* Миниатюра календаря */}
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Календарь</h3>
              <Calendar
                mode="single"
                selected={currentDate}
                month={currentDate}
                className="rounded-md border-0 p-0"
                classNames={{
                  months: "flex flex-col space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-xs",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-semibold",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                }}
              />
            </CardContent>
          </Card>

          {/* Фильтры по типам активностей */}
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3 text-gray-700">Фильтры активностей</h3>
              <div className="space-y-3">
                {activityTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={`filter-${type}`}
                      checked={!filteredTypes.has(type)}
                      onCheckedChange={(checked) => handleTypeFilterChange(type, checked as boolean)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`filter-${type}`}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm text-gray-700">{getTypeDisplayName(type)}</span>
                      <Badge variant="secondary" className={`text-xs px-2 py-1 ${getTypeColor(type)}`}>
                        {activities.filter(a => a.type === type).length}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основная область календаря */}
        <Card className="flex-1 h-[700px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Активности дня</span>
              </h2>
              <Badge variant="outline" className="bg-red-500 text-white">
                Сейчас: {currentTimeString}
              </Badge>
            </div>

            <div className="flex h-[600px] overflow-y-auto">
              {/* Временная шкала слева */}
              <TimeMarkers timeMarkers={timeMarkers} />

              {/* Область активностей */}
              <div 
                className="flex-1 relative pl-4 cursor-pointer" 
                style={{ height: '1440px' }}
                onClick={handleEmptyAreaClick}
              >
                {/* Сетка часов */}
                {timeMarkers.slice(0, 24).map(({ hour, position }) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-gray-100 hover:border-gray-200 transition-colors"
                    style={{ top: `${position}px` }}
                  />
                ))}

                {/* Активности */}
                {activityLayouts.map((layout) => (
                  <div key={layout.activity.id} data-activity-card>
                    <ActivityCard layout={layout} />
                  </div>
                ))}

                {/* Индикатор текущего времени */}
                <CurrentTimeIndicator />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default DayView;
