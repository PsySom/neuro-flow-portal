
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { generateTimeMarkers, calculateActivityLayouts } from '../utils/timeUtils';
import TimeMarkers from './TimeMarkers';
import ActivityCard from './ActivityCard';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import DayViewHeader from './DayViewHeader';
import { Activity } from '@/contexts/ActivitiesContext';

interface DayViewCalendarProps {
  visibleActivities: Activity[];
  currentDate: Date;
  onEmptyAreaClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onActivityToggle: (activityId: number) => void;
  onUpdateActivity?: (id: number, updates: Partial<Activity>) => void;
  onDeleteActivity?: (id: number) => void;
}

const DayViewCalendar: React.FC<DayViewCalendarProps> = ({
  visibleActivities,
  currentDate,
  onEmptyAreaClick,
  onActivityToggle,
  onUpdateActivity,
  onDeleteActivity
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const activityLayouts = calculateActivityLayouts(visibleActivities);
  const timeMarkers = generateTimeMarkers();

  // Функция автоскроллинга к текущему времени
  const scrollToCurrentTime = () => {
    if (!scrollAreaRef.current) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Рассчитываем позицию текущего времени (90px на час)
    const currentTimePosition = currentHour * 90 + (currentMinute / 60) * 90;
    
    const containerHeight = scrollAreaRef.current.clientHeight;
    let scrollTop;

    // Логика позиционирования: в первой половине дня (до 12:00) - в верхней трети
    if (currentHour < 12) {
      scrollTop = Math.max(0, currentTimePosition - containerHeight / 3);
    } else {
      // После полудня постепенно двигаемся к центру и ниже
      const progressAfterNoon = (currentHour - 12) / 12; // от 0 до 1
      const targetPosition = containerHeight / 3 + (progressAfterNoon * containerHeight / 3);
      scrollTop = Math.max(0, currentTimePosition - targetPosition);
    }

    scrollAreaRef.current.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  };

  // Автоскроллинг при загрузке компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCurrentTime();
    }, 100); // Небольшая задержка для корректного рендеринга

    return () => clearTimeout(timer);
  }, [currentDate]);

  return (
    <Card className="flex-1 h-[700px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-6">
        <DayViewHeader
          visibleActivitiesCount={visibleActivities.length}
          currentTimeString={currentTimeString}
          onScrollToCurrentTime={scrollToCurrentTime}
        />

        <div 
          ref={scrollAreaRef}
          className="flex h-[600px] overflow-y-auto"
        >
          {/* Временная шкала слева */}
          <TimeMarkers timeMarkers={timeMarkers} />

          {/* Область активностей */}
          <div 
            className="flex-1 relative pl-4 cursor-pointer" 
            style={{ height: '2160px' }}
            onClick={onEmptyAreaClick}
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
                <ActivityCard 
                  layout={layout} 
                  onToggleComplete={onActivityToggle}
                  onUpdate={onUpdateActivity}
                  onDelete={onDeleteActivity}
                />
              </div>
            ))}

            {/* Индикатор текущего времени */}
            <CurrentTimeIndicator />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayViewCalendar;
