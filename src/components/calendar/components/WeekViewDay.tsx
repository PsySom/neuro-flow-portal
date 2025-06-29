
import React, { memo } from 'react';
import ActivityCard from './ActivityCard';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import { ActivityLayout } from '../types';
import { DeleteRecurringOption, RecurringActivityOptions } from '../utils/recurringUtils';

interface WeekViewDayProps {
  day: Date;
  dayIndex: number;
  dayActivities: ActivityLayout[];
  hours: number[];
  onEmptyAreaClick: (e: React.MouseEvent<HTMLDivElement>, dayIndex: number) => void;
  onActivityToggle: (activityId: number) => void;
  onActivityDelete: (activityId: number, deleteOption?: DeleteRecurringOption) => void;
  onActivityUpdate: (activityId: number, updates: any, recurringOptions?: RecurringActivityOptions) => void;
}

const WeekViewDay: React.FC<WeekViewDayProps> = memo(({
  day,
  dayIndex,
  dayActivities,
  hours,
  onEmptyAreaClick,
  onActivityToggle,
  onActivityDelete,
  onActivityUpdate
}) => {
  const isToday = day.toDateString() === new Date().toDateString();

  return (
    <div 
      className="flex-1 border-r border-gray-200 last:border-r-0 relative min-w-[120px] cursor-pointer"
      onClick={(e) => onEmptyAreaClick(e, dayIndex)}
    >
      {/* Hour grid */}
      {hours.map((hour) => (
        <div 
          key={hour}
          className="absolute w-full h-[90px] border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
          style={{ top: `${hour * 90}px` }}
        />
      ))}
      
      {/* Current time indicator */}
      {isToday && <CurrentTimeIndicator />}
      
      {/* Activities */}
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
});

WeekViewDay.displayName = 'WeekViewDay';

export default WeekViewDay;
