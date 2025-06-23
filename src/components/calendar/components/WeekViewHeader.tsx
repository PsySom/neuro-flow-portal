
import React from 'react';

interface WeekViewHeaderProps {
  weekDays: Date[];
}

const WeekViewHeader: React.FC<WeekViewHeaderProps> = ({ weekDays }) => {
  return (
    <div className="flex h-12 border-b border-gray-200 bg-gray-50">
      <div className="w-20 border-r border-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-medium text-gray-500">Время</span>
      </div>
      
      {weekDays.map((day, dayIndex) => (
        <div key={`header-${dayIndex}`} className="flex-1 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-xs text-gray-500">
            {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
          </span>
          <span className="text-sm font-medium">
            {day.getDate()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WeekViewHeader;
