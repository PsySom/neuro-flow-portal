
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { calculateActivityLayouts, generateTimeMarkers } from './utils/timeUtils';
import TimeMarkers from './components/TimeMarkers';
import ActivityCard from './components/ActivityCard';
import CurrentTimeIndicator from './components/CurrentTimeIndicator';
import { baseActivities } from './data/activitiesData';

interface DayViewProps {
  currentDate: Date;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const activityLayouts = calculateActivityLayouts(baseActivities);
  const timeMarkers = generateTimeMarkers();

  return (
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
          <div className="flex-1 relative pl-4" style={{ height: '1440px' }}>
            {/* Сетка часов */}
            {timeMarkers.slice(0, 24).map(({ hour, position }) => (
              <div
                key={hour}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${position}px` }}
              />
            ))}

            {/* Активности */}
            {activityLayouts.map((layout) => (
              <ActivityCard key={layout.activity.id} layout={layout} />
            ))}

            {/* Индикатор текущего времени */}
            <CurrentTimeIndicator />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayView;
