
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Edit, Star, Trash2 } from 'lucide-react';
import { Activity } from './types';
import { timeToMinutes } from './timeUtils';

interface ActivityCardProps {
  activity: Activity;
  startHour: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, startHour }) => {
  return (
    <div 
      className={`${activity.color} rounded-lg p-3 mb-3 border border-gray-200 h-[85px] flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1">
          <Checkbox 
            checked={activity.completed}
            className="w-8 h-8 rounded-sm mt-0.5"
          />
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-sm leading-tight">
              {activity.name}
              {timeToMinutes(activity.endTime) < timeToMinutes(activity.startTime) && (
                startHour === 0 ? 
                ` (00:00-${activity.endTime})` : 
                startHour >= 21 ? ` (${activity.startTime}-24:00)` : ''
              )}
            </span>
            
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span>[{activity.startTime}-{activity.endTime}]</span>
              <span>[{activity.duration}]</span>
              <div className="flex items-center">
                {Array.from({ length: activity.importance }, (_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg">{activity.emoji}</span>
              {activity.type === 'восстановление' && activity.needEmoji && (
                <span className="text-sm">{activity.needEmoji}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Info className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Edit className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Star className="w-3 h-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
