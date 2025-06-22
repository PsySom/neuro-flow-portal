
import React, { useRef, useCallback } from 'react';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const getActivitiesForDay = (day: Date) => {
    const dayString = day.toISOString().split('T')[0];
    
    // Фильтруем активности по дате
    const dayActivities = activities.filter(activity => 
      activity.date === dayString
    );
    
    console.log(`Activities for ${dayString}:`, dayActivities.length);
    
    // Используем специальную логику для недельного календаря
    return dayActivities.map(activity => {
      const [startHour, startMin] = activity.startTime.split(':').map(Number);
      const [endHour, endMin] = activity.endTime.split(':').map(Number);
      
      let startMinutes = startHour * 60 + startMin;
      let endMinutes = endHour * 60 + endMin;
      
      // Обработка активностей через полночь
      if (endMinutes < startMinutes) {
        endMinutes += 24 * 60;
      }
      
      const duration = endMinutes - startMinutes;
      const topPosition = (startMinutes / 60) * 90; // 90px на час
      const height = (duration / 60) * 90; // высота пропорциональна времени
      
      return {
        activity,
        top: topPosition,
        height,
        left: 0, // начинаем с левого края
        width: 100, // 100% ширины столбца
        column: 0,
        totalColumns: 1
      };
    });
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
          {/* Полная ширина для контейнера */}
          <div className="w-full flex flex-col">
            {/* Заголовки дней - фиксированная верхняя часть */}
            <div className="flex h-12 border-b border-gray-200 flex-shrink-0">
              {/* Пустая ячейка для колонки времени */}
              <div className="w-20 bg-gray-50 border-r border-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-500">Время</span>
              </div>
              
              {/* Заголовки дней */}
              {weekDays.map((day, dayIndex) => (
                <div key={`header-${dayIndex}`} className="flex-1 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center bg-gray-50 min-w-[120px]">
                  <span className="text-xs text-gray-500">
                    {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">
                    {day.getDate()}
                  </span>
                </div>
              ))}
            </div>

            {/* Скроллируемая область */}
            <div className="flex-1 relative">
              <ScrollArea ref={scrollAreaRef} className="h-full">
                <div className="flex" style={{ height: '2160px' }}>
                  {/* Колонка времени */}
                  <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0">
                    {hours.map((hour) => (
                      <div 
                        key={hour} 
                        className="h-[90px] border-b border-gray-100 flex items-start justify-center pt-1 text-xs text-gray-500"
                      >
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {/* Дни недели */}
                  {weekDays.map((day, dayIndex) => {
                    const dayActivities = getActivitiesForDay(day);
                    
                    return (
                      <div key={dayIndex} className="flex-1 border-r border-gray-200 last:border-r-0 relative min-w-[120px]">
                        {/* Сетка часов */}
                        {hours.map((hour) => (
                          <div 
                            key={hour}
                            className="absolute w-full h-[90px] border-b border-gray-100"
                            style={{ top: `${hour * 90}px` }}
                          />
                        ))}
                        
                        {/* Активности для этого дня */}
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
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekView;
