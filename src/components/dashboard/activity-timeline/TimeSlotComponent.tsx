
import React from 'react';
import { Plus } from 'lucide-react';
import { TimeSlot } from './types';
import { isActivityStart } from './timeUtils';
import ActivityCard from './ActivityCard';

interface TimeSlotComponentProps {
  slot: TimeSlot;
}

const TimeSlotComponent: React.FC<TimeSlotComponentProps> = ({ slot }) => {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-b-0 min-h-[95px]">
      <div className="w-20 text-sm font-medium text-gray-600 py-3">
        {slot.timeString}
      </div>
      <div className="flex-1 relative">
        {slot.activities.length > 0 ? (
          slot.activities.map((activity) => 
            isActivityStart(activity, slot.startHour) ? (
              <ActivityCard 
                key={`${activity.id}-${slot.startHour}`}
                activity={activity}
                startHour={slot.startHour}
              />
            ) : null
          )
        ) : (
          <div className="h-[85px] bg-gray-50 rounded-lg flex items-center justify-center opacity-50 hover:opacity-75 cursor-pointer">
            <Plus className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotComponent;
