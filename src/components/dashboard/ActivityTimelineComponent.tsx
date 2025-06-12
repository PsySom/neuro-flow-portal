import React, { useState, useEffect, useRef } from 'react';
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timeIndicatorRef = useRef<HTMLDivElement>(null);
  const lastInteractionRef = useRef(Date.now());

  // Обновление текущего времени каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Автоскроллинг после 20 секунд бездействия
  useEffect(() => {
    const checkAutoScroll = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      if (timeSinceLastInteraction >= 20000) { // 20 секунд
        scrollToCurrentTime();
      }
    };

    const autoScrollTimer = setInterval(checkAutoScroll, 5000); // Проверяем каждые 5 секунд

    return () => clearInterval(autoScrollTimer);
  }, []);

  // Обработчик взаимодействия пользователя
  const handleUserInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  // Функция скролла к текущему времени
  const scrollToCurrentTime = () => {
    if (timeIndicatorRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const indicatorTop = timeIndicatorRef.current.offsetTop;
        const containerHeight = scrollContainer.clientHeight;
        const scrollTop = indicatorTop - containerHeight / 2;
        
        scrollContainer.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  };

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

  // Вычисление позиции индикатора текущего времени
  const getCurrentTimePosition = () => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    
    // Находим подходящий временной слот
    const slotIndex = Math.floor(currentHour / 3);
    const slotStartMinutes = slotIndex * 180; // 3 часа = 180 минут
    const minutesIntoSlot = totalMinutes - slotStartMinutes;
    
    // Высота одного слота (95px + padding)
    const slotHeight = 95 + 8; // 95px высота + 8px padding
    const positionInSlot = (minutesIntoSlot / 180) * slotHeight;
    
    return slotIndex * slotHeight + positionInSlot + 60; // +60 для учета заголовка
  };

  const currentTimeString = currentTime.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Group activities into 8 three-hour blocks
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const startHour = i * 3;
    const endHour = (i + 1) * 3;
    const timeString = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
    
    // Find activities for this 3-hour block
    const blockActivities = activities.filter(activity => {
      const activityStartHour = parseInt(activity.startTime.split(':')[0]);
      const activityEndHour = parseInt(activity.endTime.split(':')[0]);
      const activityEndMinute = parseInt(activity.endTime.split(':')[1]);
      
      // Activity overlaps with this 3-hour block
      return (activityStartHour < endHour && (activityEndHour > startHour || (activityEndHour === endHour && activityEndMinute > 0)));
    });

    return {
      startHour,
      endHour,
      timeString,
      activities: blockActivities
    };
  });

  const isActivityStart = (activity: Activity, startHour: number) => {
    const activityStartHour = parseInt(activity.startTime.split(':')[0]);
    return activityStartHour >= startHour && activityStartHour < startHour + 3;
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
      
      <CardContent className="p-0 relative">
        <ScrollArea 
          ref={scrollAreaRef} 
          className="h-[500px]"
          onWheel={handleUserInteraction}
          onTouchStart={handleUserInteraction}
          onMouseDown={handleUserInteraction}
        >
          <div className="px-6 relative">
            {/* Индикатор текущего времени */}
            <div 
              ref={timeIndicatorRef}
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${getCurrentTimePosition()}px` }}
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

            {timeSlots.map((slot) => (
              <div key={slot.startHour} className="flex items-start py-2 border-b border-gray-100 last:border-b-0 min-h-[95px]">
                <div className="w-20 text-sm font-medium text-gray-600 py-3">
                  {slot.timeString}
                </div>
                <div className="flex-1 relative">
                  {slot.activities.length > 0 ? (
                    slot.activities.map((activity) => 
                      isActivityStart(activity, slot.startHour) ? (
                        <div 
                          key={activity.id} 
                          className={`${activity.color} rounded-lg p-3 mb-3 border border-gray-200 h-[85px] flex flex-col justify-between`}
                        >
                          {/* Первая строка: галочка, название и кнопки */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2 flex-1">
                              <Checkbox 
                                checked={activity.completed}
                                className="w-8 h-8 rounded-sm mt-0.5"
                              />
                              <div className="flex flex-col space-y-1">
                                <span className="font-medium text-sm leading-tight">{activity.name}</span>
                                
                                {/* Вторая строка: время, продолжительность и звездочки */}
                                <div className="flex items-center space-x-4 text-xs text-gray-600">
                                  <span>[{activity.startTime}-{activity.endTime}]</span>
                                  <span>[{activity.duration}]</span>
                                  <div className="flex items-center">
                                    {Array.from({ length: activity.importance }, (_, i) => (
                                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>

                                {/* Третья строка: эмодзи */}
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{activity.emoji}</span>
                                  {activity.type === 'восстановление' && activity.needEmoji && (
                                    <span className="text-sm">{activity.needEmoji}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
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
                        </div>
                      ) : null
                    )
                  ) : (
                    <div className="h-[85px] bg-gray-50 rounded-lg flex items-center justify-center opacity-50 hover:opacity-75 cursor-pointer">
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
