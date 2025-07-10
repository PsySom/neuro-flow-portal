
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActivityCard from '@/components/calendar/components/ActivityCard';
import { Activity } from '@/contexts/ActivitiesContext';
import { DeleteRecurringOption, RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

interface ActivityTimelineContentProps {
  activities: Activity[];
  onActivityToggle: (activityId: number | string) => void;
  onActivityDelete: (activityId: number | string, deleteOption?: DeleteRecurringOption) => void;
  onActivityUpdate: (activityId: number | string, updates: Activity, recurringOptions?: RecurringActivityOptions) => void;
}

const ActivityTimelineContent: React.FC<ActivityTimelineContentProps> = ({
  activities,
  onActivityToggle,
  onActivityDelete,
  onActivityUpdate
}) => {
  return (
    <CardContent className="p-6">
      <ScrollArea className="h-[480px]">
        <div className="space-y-0">
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
              onToggleComplete={onActivityToggle}
              onDelete={onActivityDelete}
              onUpdate={(id, updates, recurringOptions) => onActivityUpdate(id, updates as Activity, recurringOptions)}
              viewType="dashboard"
            />
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default ActivityTimelineContent;
