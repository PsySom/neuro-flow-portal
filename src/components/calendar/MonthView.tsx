
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/contexts/ActivitiesContext';

interface MonthViewProps {
  currentDate: Date;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const { getActivitiesForDate } = useActivities();
  const today = new Date();
  
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to start from Monday
    const startDay = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));
    
    const endDay = lastDay.getDay();
    endDate.setDate(lastDay.getDate() + (endDay === 0 ? 0 : 7 - endDay));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, currentMonth: month, currentYear: year };
  };

  const { days, currentMonth, currentYear } = getMonthData();
  const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const getActivitiesForDateObj = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const activities = getActivitiesForDate(dateString);
    return activities;
  };

  const truncateText = (text: string, maxLength: number = 12) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="h-10 flex items-center justify-center bg-gray-100 text-sm font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {days.map((date, index) => {
            const activities = getActivitiesForDateObj(date);
            const maxVisibleActivities = 3;
            const visibleActivities = activities.slice(0, maxVisibleActivities);
            const hiddenCount = activities.length - maxVisibleActivities;
            
            return (
              <div
                key={index}
                className={`bg-white min-h-[120px] p-2 flex flex-col ${
                  !isCurrentMonth(date) ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday(date) ? 'bg-blue-50 border-2 border-blue-500' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-blue-600 font-bold' : ''
                  }`}>
                    {date.getDate()}
                  </span>
                  {activities.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-1">
                      {activities.length}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 space-y-1 overflow-hidden">
                  {visibleActivities.map((activity, activityIndex) => (
                    <div
                      key={`${activity.id}-${activityIndex}`}
                      className={`${activity.color} text-white text-xs px-1 py-0.5 rounded truncate flex items-center space-x-1`}
                      title={`${activity.emoji} ${activity.name} (${activity.startTime}-${activity.endTime})`}
                    >
                      <span>{activity.emoji}</span>
                      <span className="flex-1 truncate">{truncateText(activity.name)}</span>
                      <span className="text-xs opacity-75">{activity.startTime}</span>
                    </div>
                  ))}
                  
                  {hiddenCount > 0 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{hiddenCount} еще
                    </div>
                  )}
                </div>
                
                {/* Add event button for current month days */}
                {isCurrentMonth(date) && activities.length === 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-full text-xs text-gray-400 hover:text-gray-600 mt-1"
                  >
                    +
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span className="text-sm text-gray-600">Задачи</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span className="text-sm text-gray-600">Восстановление</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-200 rounded"></div>
            <span className="text-sm text-gray-600">Смешанные</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span className="text-sm text-gray-600">Нейтральные</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthView;
