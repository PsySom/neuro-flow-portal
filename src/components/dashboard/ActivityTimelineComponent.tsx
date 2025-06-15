
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Plus } from 'lucide-react';
import { useTimelineLogic } from './activity-timeline/useTimelineLogic';
import { activities } from './activity-timeline/activityData';
import { createTimeSlots } from './activity-timeline/timeUtils';
import TimeIndicator from './activity-timeline/TimeIndicator';
import TimeSlotComponent from './activity-timeline/TimeSlotComponent';

const ActivityTimelineComponent = () => {
  const {
    currentTime,
    scrollAreaRef,
    timeIndicatorRef,
    handleUserInteraction
  } = useTimelineLogic();

  const timeSlots = createTimeSlots(activities);

  return (
    <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>Лента активности</span>
        </CardTitle>
        <Button size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        <ScrollArea 
          ref={scrollAreaRef} 
          className="h-[500px]"
          onWheel={handleUserInteraction}
          onTouchStart={handleUserInteraction}
          onMouseDown={handleUserInteraction}
        >
          <div className="px-6 relative">
            <TimeIndicator 
              currentTime={currentTime}
              timeIndicatorRef={timeIndicatorRef}
            />

            {timeSlots.map((slot) => (
              <TimeSlotComponent 
                key={slot.startHour}
                slot={slot}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineComponent;
