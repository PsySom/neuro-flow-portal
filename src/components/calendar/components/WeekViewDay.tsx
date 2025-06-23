
import React from 'react';
import ActivityCard from './ActivityCard';
import CurrentTimeIndicator from './CurrentTimeIndicator';

interface WeekViewDayProps {
  day: Date;
  dayIndex: number;
  dayActivities: any[];
  hours: number[];
  onEmptyAreaClick: (e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => void;
  onActivityToggle: (activityId: number) => void;
  onActivityDelete: (activityId: number, deleteOption?: any) => void;
  onActivityUpdate: (activityId: number, updates: any, recurringOptions?: any) => void;
}

const WeekViewDay: React.FC<WeekViewDayProps> = ({
  day,
  dayIndex,
  dayActivities,
  hours,
  onEmptyAreaClick,
  onActivityToggle,
  onActivityDelete,
  onActivityUpdate
}) => {
  return (
    <div 
      className="flex-1 border-r border-gray-200 last:border-r-0 relative min-w-[120px] cursor-pointer"
      onClick={(e) => onEmptyAreaClick(e, dayIndex)}
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
            onToggleComplete={onActivityToggle}
            onDelete={onActivityDelete}
            onUpdate={onActivityUpdate}
            viewType="week"
          />
        </div>
      ))}
    </div>
  );
};

export default WeekViewDay;
