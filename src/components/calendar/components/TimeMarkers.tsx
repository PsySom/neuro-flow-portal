
import React from 'react';
import { TimeMarker } from '../types';

interface TimeMarkersProps {
  timeMarkers: TimeMarker[];
}

const TimeMarkers: React.FC<TimeMarkersProps> = ({ timeMarkers }) => {
  return (
    <div className="w-16 flex-shrink-0 relative border-r border-gray-200">
      {timeMarkers.map(({ hour, time, position }) => (
        <div 
          key={hour}
          className="absolute text-xs text-gray-500 -translate-y-2"
          style={{ top: `${position}px` }}
        >
          {hour < 24 ? time : ''}
        </div>
      ))}
    </div>
  );
};

export default TimeMarkers;
