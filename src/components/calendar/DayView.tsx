
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { calculateActivityLayouts, generateTimeMarkers } from './utils/timeUtils';
import TimeMarkers from './components/TimeMarkers';
import ActivityCard from './components/ActivityCard';
import CurrentTimeIndicator from './components/CurrentTimeIndicator';
import CreateActivityDialog from './components/CreateActivityDialog';
import { baseActivities } from './data/activitiesData';
import { Activity } from './types';

interface DayViewProps {
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const [activities, setActivities] = useState<Activity[]>(baseActivities);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const activityLayouts = calculateActivityLayouts(activities);
  const timeMarkers = generateTimeMarkers();

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Check if click is on empty area (not on an activity card)
    if (target.closest('[data-activity-card]')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    
    // Calculate the time based on click position (60px per hour)
    const hourFromTop = Math.floor(clickY / 60);
    const minuteFromTop = Math.floor((clickY % 60));
    
    const clickTime = `${hourFromTop.toString().padStart(2, '0')}:${Math.round(minuteFromTop).toString().padStart(2, '0')}`;
    
    setSelectedTime(clickTime);
    setIsCreateDialogOpen(true);
  };

  const handleActivityCreate = (newActivity: Activity) => {
    setActivities(prev => [...prev, newActivity]);
  };

  return (
    <>
      <Card className="h-[700px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Активности дня</span>
            </h2>
            <Badge variant="outline" className="bg-red-500 text-white">
              Сейчас: {currentTimeString}
            </Badge>
          </div>

          <div className="flex h-[600px] overflow-y-auto">
            {/* Временная шкала слева */}
            <TimeMarkers timeMarkers={timeMarkers} />

            {/* Область активностей */}
            <div 
              className="flex-1 relative pl-4 cursor-pointer" 
              style={{ height: '1440px' }}
              onClick={handleEmptyAreaClick}
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
                  <ActivityCard layout={layout} />
                </div>
              ))}

              {/* Индикатор текущего времени */}
              <CurrentTimeIndicator />
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateActivityDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialTime={selectedTime}
        onActivityCreate={handleActivityCreate}
      />
    </>
  );
};

export default DayView;
