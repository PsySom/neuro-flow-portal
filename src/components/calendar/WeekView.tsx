
import React, { useRef, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useActivities } from '@/contexts/ActivitiesContext';
import ActivityCard from './components/ActivityCard';
import CurrentTimeIndicator from './components/CurrentTimeIndicator';
import DayViewSidebar from './components/DayViewSidebar';
import CreateActivityDialog from './components/CreateActivityDialog';
import { DeleteRecurringOption } from './utils/recurringUtils';

interface WeekViewProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, onDateChange }) => {
  const { activities, getActivitiesForDate, updateActivity, deleteActivity, toggleActivityComplete, addActivity } = useActivities();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [filteredTypes, setFilteredTypes] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  console.log('WeekView total activities:', activities.length);

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

  // Получаем все активности для текущей недели
  const getWeekActivities = () => {
    const weekActivities = [];
    weekDays.forEach(day => {
      const dayString = day.toISOString().split('T')[0];
      const dayActivities = getActivitiesForDate(dayString);
      weekActivities.push(...dayActivities);
    });
    return weekActivities;
  };

  const weekActivities = getWeekActivities();

  const getActivitiesForDay = (day: Date) => {
    const dayString = day.toISOString().split('T')[0];
    
    // Получаем активности для дня и фильтруем по типам
    const dayActivities = getActivitiesForDate(dayString).filter(activity => 
      !filteredTypes.has(activity.type)
    );
    
    console.log(`Activities for ${dayString}:`, dayActivities.length, dayActivities);
    
    // Преобразуем активности для отображения в недельном календаре
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
      const height = Math.max((duration / 60) * 90, 30); // минимальная высота 30px
      
      return {
        activity,
        top: topPosition,
        height,
        left: 0,
        width: 100,
        column: 0,
        totalColumns: 1
      };
    });
  };

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => {
    const target = e.target as HTMLElement;
    
    // Проверяем, что клик не по карточке активности
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    // Вычисляем время на основе позиции клика (90px на час)
    const hourFromTop = Math.floor(clickY / 90);
    const minuteFromTop = Math.floor((clickY % 90) * (60 / 90));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    const clickDate = weekDays[dayIndex].toISOString().split('T')[0];
    
    console.log('Week view click:', clickTime, 'on', clickDate);
    
    setSelectedTime(clickTime);
    setSelectedDate(clickDate);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: any, recurringOptions?: any) => {
    // Устанавливаем дату из selectedDate
    const activityWithDate = {
      ...newActivity,
      date: newActivity.date || selectedDate
    };
    console.log('Creating activity in week view:', activityWithDate);
    addActivity(activityWithDate, recurringOptions);
  };

  const handleActivityUpdate = (activityId: number, updates: any) => {
    updateActivity(activityId, updates);
  };

  const handleActivityDelete = (activityId: number, deleteOption?: DeleteRecurringOption) => {
    deleteActivity(activityId, deleteOption);
  };

  const handleActivityToggle = (activityId: number) => {
    toggleActivityComplete(activityId);
  };

  const handleTypeFilterChange = (type: string, checked: boolean) => {
    console.log('Week filter change:', type, checked);
    setFilteredTypes(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      console.log('Week new filtered types:', Array.from(newSet));
      return newSet;
    });
  };

  const handleDateSelect = (date: Date) => {
    console.log('Date selected in WeekView:', date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return (
    <>
      <div className="flex gap-6">
        {/* Боковая панель слева */}
        <DayViewSidebar
          currentDate={currentDate}
          activities={weekActivities}
          filteredTypes={filteredTypes}
          onTypeFilterChange={handleTypeFilterChange}
          onDateSelect={handleDateSelect}
        />

        {/* Основная область календаря */}
        <div className="flex-1">
          <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-0">
              {/* Заголовки дней - фиксированная верхняя часть */}
              <div className="flex h-12 border-b border-gray-200 bg-gray-50">
                {/* Пустая ячейка для колонки времени */}
                <div className="w-20 border-r border-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-500">Время</span>
                </div>
                
                {/* Заголовки дней */}
                {weekDays.map((day, dayIndex) => (
                  <div key={`header-${dayIndex}`} className="flex-1 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-xs text-gray-500">
                      {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">
                      {day.getDate()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Скроллируемая область календаря */}
              <div className="h-[720px] overflow-y-auto" ref={scrollAreaRef}>
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
                      <div 
                        key={dayIndex} 
                        className="flex-1 border-r border-gray-200 last:border-r-0 relative min-w-[120px] cursor-pointer"
                        onClick={(e) => handleEmptyAreaClick(e, dayIndex)}
                      >
                        {/* Сетка часов */}
                        {hours.map((hour) => (
                          <div 
                            key={hour}
                            className="absolute w-full h-[90px] border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                            style={{ top: `${hour * 90}px` }}
                          />
                        ))}
                        
                        {/* Индикатор текущего времени только для сегодня */}
                        {day.toDateString() === new Date().toDateString() && (
                          <CurrentTimeIndicator />
                        )}
                        
                        {/* Активности для этого дня */}
                        {dayActivities.map((layout, activityIndex) => (
                          <div key={`${dayIndex}-${layout.activity.id}-${activityIndex}`} data-activity-card>
                            <ActivityCard
                              layout={layout}
                              onToggleComplete={handleActivityToggle}
                              onDelete={handleActivityDelete}
                              onUpdate={handleActivityUpdate}
                              viewType="week"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        initialDate={selectedDate}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default WeekView;
