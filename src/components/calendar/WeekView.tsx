
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

  // Рассчитываем раскладку активностей
  const activityLayouts = calculateActivityLayouts(activities);

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
        {/* Fixed header with days */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="h-12 border-r border-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">Время</span>
          </div>
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="h-12 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500">
                {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
              </span>
              <span className="text-sm font-medium">
                {day.getDate()}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable content area */}
        <ScrollArea className="h-[652px]">
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="border-r border-gray-200">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="h-[90px] border-b border-gray-100 flex items-center justify-center text-xs text-gray-500"
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div 
                    key={hour}
                    className="h-[90px] border-b border-gray-100"
                  />
                ))}
                
                {/* Activities for this day - показываем все активности только в понедельник (dayIndex === 0) для демонстрации */}
                {dayIndex === 0 && activityLayouts.map((layout) => (
                  <ActivityCard
                    key={layout.activity.id}
                    layout={layout}
                    onToggleComplete={handleActivityToggle}
                    onDelete={handleActivityDelete}
                    onUpdate={handleActivityUpdate}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WeekView;
