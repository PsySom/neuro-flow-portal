
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActivities } from '@/contexts/ActivitiesContext';
import { calculateActivityLayouts } from './utils/timeUtils';
import ActivityCard from './components/ActivityCard';

interface WeekViewProps {
  currentDate: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate }) => {
  const { activities, updateActivity, deleteActivity, toggleActivityComplete } = useActivities();

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Получаем активности для конкретного дня
  const getActivitiesForDay = (day: Date) => {
    const dayString = day.toISOString().split('T')[0];
    
    // Фильтруем активности по дате (пока используем все активности как демо-данные)
    // В реальном приложении здесь будет фильтрация по activity.date
    const dayActivities = activities.filter((activity, index) => {
      // Временная логика: распределяем активности по дням недели циклично
      const dayIndex = weekDays.findIndex(weekDay => 
        weekDay.toDateString() === day.toDateString()
      );
      return index % 7 === dayIndex;
    });
    
    return calculateActivityLayouts(dayActivities);
  };

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivity(activityId, updates);
  };

  const handleActivityDelete = (activityId: number) => {
    deleteActivity(activityId);
  };

  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-0">
        <div className="flex h-[600px]">
          {/* Time column - fixed */}
          <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            {/* Header */}
            <div className="h-12 border-b border-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">Время</span>
            </div>
            
            {/* Time markers */}
            <ScrollArea className="h-[548px]">
              <div>
                {hours.map((hour) => (
                  <div 
                    key={hour} 
                    className="h-[90px] border-b border-gray-100 flex items-start justify-center pt-1 text-xs text-gray-500"
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Days columns - scrollable */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-7 h-full">
              {/* Days header */}
              {weekDays.map((day, dayIndex) => (
                <div key={`header-${dayIndex}`} className="h-12 border-r border-gray-200 last:border-r-0 border-b border-gray-200 flex flex-col items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-500">
                    {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">
                    {day.getDate()}
                  </span>
                </div>
              ))}

              {/* Days content */}
              {weekDays.map((day, dayIndex) => {
                const dayActivities = getActivitiesForDay(day);
                
                return (
                  <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative min-w-[120px] h-[548px] overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="relative" style={{ height: '2160px' }}>
                        {/* Hour grid lines */}
                        {hours.map((hour) => (
                          <div 
                            key={hour}
                            className="absolute w-full h-[90px] border-b border-gray-100"
                            style={{ top: `${hour * 90}px` }}
                          />
                        ))}
                        
                        {/* Activities for this day */}
                        {dayActivities.map((layout, activityIndex) => (
                          <ActivityCard
                            key={`${dayIndex}-${layout.activity.id}-${activityIndex}`}
                            layout={layout}
                            onToggleComplete={handleActivityToggle}
                            onDelete={handleActivityDelete}
                            onUpdate={handleActivityUpdate}
                            viewType="week"
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekView;
