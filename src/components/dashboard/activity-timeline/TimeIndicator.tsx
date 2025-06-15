
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

  return (
    <div 
      ref={timeIndicatorRef}
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${getCurrentTimePosition(currentTime)}px` }}
    >
      <div className="flex items-center">
        <div className="w-20 flex justify-center">
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {currentTimeString}
          </span>
        </div>
        <div 
          className="flex-1 h-0.5 bg-red-500 relative"
          style={{ height: '2px' }}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TimeIndicator;
