
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Plus, Info, Edit, Star, Trash2 } from 'lucide-react';

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
  needEmoji?: string;
}

const ActivityTimelineComponent = () => {
  const activities: Activity[] = [
    { id: 1, name: 'Сон', emoji: '😴', startTime: '00:00', endTime: '08:00', duration: '8 ч', color: 'bg-indigo-200', importance: 5, completed: true, type: 'восстановление', needEmoji: '🛌' },
    { id: 2, name: 'Пробуждение', emoji: '☀️', startTime: '08:00', endTime: '08:30', duration: '30 мин', color: 'bg-yellow-200', importance: 3, completed: true, type: 'восстановление', needEmoji: '⚡' },
    { id: 3, name: 'Зарядка', emoji: '🏃‍♂️', startTime: '08:30', endTime: '09:30', duration: '1 ч', color: 'bg-green-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '💪' },
    { id: 4, name: 'Душ, завтрак, гигиена', emoji: '🚿', startTime: '09:30', endTime: '10:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '🧘' },
    { id: 5, name: 'Утренний дневник', emoji: '📝', startTime: '10:00', endTime: '10:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
    { id: 6, name: 'Дорога на работу', emoji: '🚗', startTime: '10:30', endTime: '11:00', duration: '30 мин', color: 'bg-gray-200', importance: 2, completed: false, type: 'задача' },
    { id: 7, name: 'Работа над проектом', emoji: '💼', startTime: '11:00', endTime: '12:00', duration: '1 ч', color: 'bg-orange-200', importance: 5, completed: false, type: 'задача' },
    { id: 8, name: 'Перерыв на кофе', emoji: '☕', startTime: '12:00', endTime: '12:30', duration: '30 мин', color: 'bg-amber-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌱' },
    { id: 9, name: 'Работа с документами', emoji: '📋', startTime: '13:00', endTime: '14:00', duration: '1 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
    { id: 10, name: 'Обед', emoji: '🍽️', startTime: '14:00', endTime: '14:30', duration: '30 мин', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
    { id: 11, name: 'Прогулка', emoji: '🚶‍♂️', startTime: '14:30', endTime: '15:00', duration: '30 мин', color: 'bg-emerald-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌳' },
    { id: 12, name: 'Работа с документами', emoji: '📋', startTime: '15:00', endTime: '17:00', duration: '2 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
    { id: 13, name: 'Встреча с другом', emoji: '👥', startTime: '17:00', endTime: '19:00', duration: '2 ч', color: 'bg-pink-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '❤️' },
    { id: 14, name: 'Ужин', emoji: '🍽️', startTime: '19:00', endTime: '20:00', duration: '1 ч', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
    { id: 15, name: 'Просмотр фильма', emoji: '🎬', startTime: '20:00', endTime: '21:30', duration: '1.5 ч', color: 'bg-violet-200', importance: 2, completed: false, type: 'восстановление', needEmoji: '🎭' },
    { id: 16, name: 'Душ, гигиена', emoji: '🚿', startTime: '21:30', endTime: '22:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '🧘' },
    { id: 17, name: 'Заполнение дневника', emoji: '📝', startTime: '22:00', endTime: '22:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
    { id: 18, name: 'Подготовка ко сну', emoji: '🌙', startTime: '22:30', endTime: '24:00', duration: '1.5 ч', color: 'bg-indigo-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '😴' }
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const timeString = hour.toString().padStart(2, '0') + ':00';
    
    // Find activities for this hour
    const hourActivities = activities.filter(activity => {
      const startHour = parseInt(activity.startTime.split(':')[0]);
      const endHour = parseInt(activity.endTime.split(':')[0]);
      const endMinute = parseInt(activity.endTime.split(':')[1]);
      
      // Activity spans this hour
      return startHour <= hour && (endHour > hour || (endHour === hour && endMinute > 0));
    });

    return {
      hour,
      timeString,
      activities: hourActivities
    };
  });

  const getActivityHeight = (activity: Activity) => {
    const start = activity.startTime.split(':');
    const end = activity.endTime.split(':');
    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
    const durationMinutes = endMinutes - startMinutes;
    
    // Base height is 48px (h-12), scale by duration in hours
    return Math.max(48, (durationMinutes / 60) * 48);
  };

  const isActivityStart = (activity: Activity, hour: number) => {
    return parseInt(activity.startTime.split(':')[0]) === hour;
  };

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
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="px-6">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="flex items-start py-1 border-b border-gray-100 last:border-b-0 min-h-[48px]">
                <div className="w-16 text-sm font-medium text-gray-600 py-2">
                  {slot.timeString}
                </div>
                <div className="flex-1 relative">
                  {slot.activities.length > 0 ? (
                    slot.activities.map((activity) => 
                      isActivityStart(activity, slot.hour) ? (
                        <div 
                          key={activity.id} 
                          className={`${activity.color} rounded-lg p-3 mb-2 border border-gray-200`}
                          style={{ height: `${getActivityHeight(activity)}px` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2 flex-1">
                              <span className="text-lg">{activity.emoji}</span>
                              {activity.type === 'восстановление' && (
                                <span className="text-sm">{activity.needEmoji}</span>
                              )}
                              <span className="font-medium text-sm">{activity.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox 
                                checked={activity.completed}
                                className="w-4 h-4"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                            <span>[{activity.startTime}-{activity.endTime}]</span>
                            <span>[{activity.duration}]</span>
                            <div className="flex items-center">
                              {Array.from({ length: activity.importance }, (_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center space-x-1">
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Info className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Star className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6">
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="h-12 bg-gray-50 rounded-lg flex items-center justify-center opacity-50 hover:opacity-75 cursor-pointer">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineComponent;
