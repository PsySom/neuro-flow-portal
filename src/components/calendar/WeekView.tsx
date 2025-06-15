
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: number;
  name: string;
  emoji: string;
  startTime: string;
  endTime: string;
  duration: string;
  color: string;
  importance: number;
  completed: boolean;
  type: string;
}

interface WeekViewProps {
  currentDate: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate }) => {
  const activities: Activity[] = [
    { id: 2, name: 'Пробуждение', emoji: '☀️', startTime: '08:00', endTime: '08:30', duration: '30 мин', color: 'bg-yellow-200', importance: 3, completed: true, type: 'восстановление' },
    { id: 3, name: 'Зарядка', emoji: '🏃‍♂️', startTime: '08:30', endTime: '09:30', duration: '1 ч', color: 'bg-green-200', importance: 4, completed: true, type: 'восстановление' },
    { id: 7, name: 'Работа над проектом', emoji: '💼', startTime: '11:00', endTime: '12:00', duration: '1 ч', color: 'bg-orange-200', importance: 5, completed: false, type: 'задача' },
    { id: 10, name: 'Обед', emoji: '🍽️', startTime: '14:00', endTime: '14:30', duration: '30 мин', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление' },
    { id: 13, name: 'Встреча с другом', emoji: '👥', startTime: '17:00', endTime: '19:00', duration: '2 ч', color: 'bg-pink-200', importance: 4, completed: false, type: 'восстановление' },
  ];

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const timeToPixels = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60 + minutes) * 0.8; // 0.8px per minute
  };

  const getDurationInPixels = (startTime: string, endTime: string) => {
    const startMinutes = timeToPixels(startTime);
    const endMinutes = timeToPixels(endTime);
    return endMinutes - startMinutes;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-0">
        <div className="grid grid-cols-8 h-[700px]">
          {/* Time column */}
          <div className="border-r border-gray-200">
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500">Время</span>
            </div>
            <div className="overflow-y-auto h-[calc(700px-48px)]">
              {hours.map((hour) => (
                <div 
                  key={hour} 
                  className="h-12 border-b border-gray-100 flex items-center justify-center text-xs text-gray-500"
                >
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Days columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative">
              <div className="h-12 border-b border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-500">
                  {day.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()}
                </span>
                <span className="text-sm font-medium">
                  {day.getDate()}
                </span>
              </div>
              
              <div className="relative h-[calc(700px-48px)] overflow-hidden">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div 
                    key={hour}
                    className="absolute w-full h-12 border-b border-gray-100"
                    style={{ top: `${hour * 48}px` }}
                  />
                ))}
                
                {/* Activities for this day */}
                {dayIndex === 1 && activities.slice(0, 3).map((activity, activityIndex) => (
                  <div
                    key={activity.id}
                    className={`absolute left-1 right-1 ${activity.color} rounded p-1 text-xs border border-gray-300 z-10`}
                    style={{
                      top: `${timeToPixels(activity.startTime)}px`,
                      height: `${getDurationInPixels(activity.startTime, activity.endTime)}px`,
                      left: `${2 + activityIndex * 2}px`,
                      right: `${2 + (2 - activityIndex) * 2}px`
                    }}
                  >
                    <div className="font-medium truncate">{activity.emoji} {activity.name}</div>
                    <div className="text-gray-600">{activity.startTime}-{activity.endTime}</div>
                  </div>
                ))}
                
                {dayIndex === 3 && activities.slice(3, 5).map((activity, activityIndex) => (
                  <div
                    key={activity.id}
                    className={`absolute left-1 right-1 ${activity.color} rounded p-1 text-xs border border-gray-300 z-10`}
                    style={{
                      top: `${timeToPixels(activity.startTime)}px`,
                      height: `${getDurationInPixels(activity.startTime, activity.endTime)}px`,
                      left: `${2 + activityIndex * 2}px`,
                      right: `${2 + (1 - activityIndex) * 2}px`
                    }}
                  >
                    <div className="font-medium truncate">{activity.emoji} {activity.name}</div>
                    <div className="text-gray-600">{activity.startTime}-{activity.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekView;
