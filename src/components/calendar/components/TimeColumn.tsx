
import React from 'react';

interface TimeColumnProps {
  hours: number[];
}

const TimeColumn: React.FC<TimeColumnProps> = ({ hours }) => {
  return (
    <div className="w-20 bg-gray-50 border-r border-gray-200 flex-shrink-0">
      {hours.map((hour) => (
        <div 
          key={hour} 
          className="h-[90px] border-b border-gray-100 flex items-start justify-center pt-1 text-xs text-gray-500"
        >
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
