
import React from 'react';
import { getCurrentTimePosition } from './timeUtils';

interface TimeIndicatorProps {
  currentTime: Date;
  timeIndicatorRef: React.RefObject<HTMLDivElement>;
}

const TimeIndicator: React.FC<TimeIndicatorProps> = ({ currentTime, timeIndicatorRef }) => {
  const currentTimeString = currentTime.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const timePosition = (currentTime.getHours() * 60) + currentTime.getMinutes();
  
  return (
    <div 
      ref={timeIndicatorRef}
      className="absolute left-0 right-6 z-20 pointer-events-none"
      style={{ top: `${timePosition}px` }}
    >
      <div className="flex items-center">
        <div className="w-16 flex justify-end pr-2">
          <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
            {currentTimeString}
          </span>
        </div>
        <div className="flex-1 h-0.5 bg-red-500 relative shadow-sm">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-md border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default TimeIndicator;
