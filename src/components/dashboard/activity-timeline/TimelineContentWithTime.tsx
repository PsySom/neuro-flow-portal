import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActivityCard from '@/components/calendar/components/ActivityCard';
import TimeIndicator from './TimeIndicator';
import ActivityTimelineEmpty from './ActivityTimelineEmpty';
import { useTimelineLogic } from './useTimelineLogic';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

interface TimelineContentWithTimeProps {
  activities: Activity[];
  onActivityToggle: (activityId: number | string) => void;
  onActivityDelete: (activityId: number | string, deleteOption?: DeleteRecurringOption) => void;
  onActivityUpdate: (activityId: number | string, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => void;
  isEmpty: boolean;
  formattedDate: string;
}

const TimelineContentWithTime: React.FC<TimelineContentWithTimeProps> = ({
  activities,
  onActivityToggle,
  onActivityDelete,
  onActivityUpdate,
  isEmpty,
  formattedDate
}) => {
  const {
    currentTime,
    scrollAreaRef,
    timeIndicatorRef,
    handleUserInteraction,
    scrollToCurrentTime
  } = useTimelineLogic();

  // Adapter function to convert ActivityCard's onUpdate signature to our onActivityUpdate signature
  const handleActivityCardUpdate = (id: number | string, updates: Partial<Activity>, recurringOptions?: RecurringActivityOptions) => {
    console.log('TimelineContent: Activity update requested for', id, updates);
    onActivityUpdate(id, updates, recurringOptions);
  };

  // Enhanced toggle function with proper type handling
  const handleActivityToggle = (activityId: number | string) => {
    console.log('TimelineContent: Toggle requested for activity ID:', activityId);
    console.log('TimelineContent: Found activities count:', activities.length);
    const targetActivity = activities.find(a => a.id === activityId);
    console.log('TimelineContent: Target activity found:', targetActivity?.name, 'completed:', targetActivity?.completed);
    onActivityToggle(activityId);
  };

  if (isEmpty) {
    return <ActivityTimelineEmpty formattedDate={formattedDate} />;
  }

  return (
    <CardContent className="p-0 h-full">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-[480px] relative"
        onScrollCapture={handleUserInteraction}
        onWheelCapture={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        <div className="relative min-h-[1440px] p-6">
          {/* Hour grid background */}
          {Array.from({ length: 24 }, (_, hour) => (
            <div
              key={hour}
              className="absolute left-6 right-6 h-[60px] border-b border-gray-100/50"
              style={{ top: `${hour * 60}px` }}
            >
              <div className="absolute -left-14 top-0 text-xs text-gray-400 font-medium">
                {String(hour).padStart(2, '0')}:00
              </div>
            </div>
          ))}
          
          {/* Current time indicator */}
          <TimeIndicator 
            currentTime={currentTime}
            timeIndicatorRef={timeIndicatorRef}
          />
          
          {/* Activities */}
          <div className="space-y-2 pt-2">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                layout={{
                  activity,
                  top: 0,
                  height: 0,
                  left: 0,
                  width: 100,
                  column: 0,
                  totalColumns: 1
                }}
                onToggleComplete={handleActivityToggle}
                onDelete={onActivityDelete}
                onUpdate={handleActivityCardUpdate}
                viewType="dashboard"
              />
            ))}
          </div>
          
          {/* Auto-scroll button */}
          <button
            onClick={scrollToCurrentTime}
            className="fixed bottom-24 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-20"
            title="Перейти к текущему времени"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default TimelineContentWithTime;