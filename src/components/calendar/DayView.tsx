
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Info, Edit, Star, Trash2 } from 'lucide-react';

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

interface DayViewProps {
  currentDate: Date;
}

interface ActivityLayout {
  activity: Activity;
  top: number;
  height: number;
  left: number;
  width: number;
  column: number;
  totalColumns: number;
}

const DayView: React.FC<DayViewProps> = ({ currentDate }) => {
  const baseActivities: Activity[] = [
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
    { id: 1, name: 'Сон', emoji: '😴', startTime: '22:30', endTime: '08:00', duration: '9.5 ч', color: 'bg-indigo-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🛌' },
  ];

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Функция для получения времени в минутах от начала дня
  const getTimeInMinutes = (timeString: string) => {
    const [hour, minute] = timeString.split(':').map(Number);
    return hour * 60 + minute;
  };

  // Функция для проверки пересечения активностей
  const activitiesOverlap = (activity1: Activity, activity2: Activity) => {
    const start1 = getTimeInMinutes(activity1.startTime);
    let end1 = getTimeInMinutes(activity1.endTime);
    const start2 = getTimeInMinutes(activity2.startTime);
    let end2 = getTimeInMinutes(activity2.endTime);
    
    // Обработка активностей, пересекающих полночь
    if (end1 < start1) end1 += 24 * 60;
    if (end2 < start2) end2 += 24 * 60;
    
    return start1 < end2 && start2 < end1;
  };

  // Функция для расчета раскладки активностей
  const calculateActivityLayouts = (): ActivityLayout[] => {
    const layouts: ActivityLayout[] = [];
    
    // Группируем пересекающиеся активности
    const activityGroups: Activity[][] = [];
    const processed = new Set<number>();
    
    baseActivities.forEach(activity => {
      if (processed.has(activity.id)) return;
      
      const group: Activity[] = [activity];
      processed.add(activity.id);
      
      // Находим все активности, которые пересекаются с текущей или с активностями группы
      let foundNew = true;
      while (foundNew) {
        foundNew = false;
        baseActivities.forEach(otherActivity => {
          if (processed.has(otherActivity.id)) return;
          
          // Проверяем пересечение с любой активностью в группе
          const overlapsWithGroup = group.some(groupActivity => 
            activitiesOverlap(groupActivity, otherActivity)
          );
          
          if (overlapsWithGroup) {
            group.push(otherActivity);
            processed.add(otherActivity.id);
            foundNew = true;
          }
        });
      }
      
      activityGroups.push(group);
    });
    
    // Для каждой группы рассчитываем позиции
    activityGroups.forEach(group => {
      // Сортируем по времени начала
      group.sort((a, b) => getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime));
      
      const totalColumns = Math.min(group.length, 4);
      const columnWidth = 100 / totalColumns;
      
      group.forEach((activity, index) => {
        const startMinutes = getTimeInMinutes(activity.startTime);
        let endMinutes = getTimeInMinutes(activity.endTime);
        
        // Обработка активностей, пересекающих полночь
        if (endMinutes < startMinutes) {
          endMinutes += 24 * 60;
        }
        
        const top = (startMinutes / 60) * 60; // 60px на час
        let height = ((endMinutes - startMinutes) / 60) * 60;
        
        // Минимальная высота - размер часового блока
        height = Math.max(height, 60);
        
        const column = index % totalColumns;
        const left = column * columnWidth;
        
        layouts.push({
          activity,
          top: Math.max(0, top),
          height: Math.min(height, 1440 - Math.max(0, top)),
          left,
          width: columnWidth,
          column,
          totalColumns
        });
      });
    });
    
    return layouts;
  };

  const activityLayouts = calculateActivityLayouts();

  // Генерируем часовые отметки
  const timeMarkers = Array.from({ length: 25 }, (_, i) => {
    const hour = i;
    return {
      hour,
      time: `${hour.toString().padStart(2, '0')}:00`,
      position: hour * 60 // 60px на час
    };
  });

  return (
    <Card className="h-[700px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Активности дня</span>
          </h2>
          <Badge variant="outline" className="bg-red-500 text-white">
            Сейчас: {currentTimeString}
          </Badge>
        </div>

        <div className="flex h-[600px] overflow-y-auto">
          {/* Временная шкала слева */}
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

          {/* Область активностей */}
          <div className="flex-1 relative pl-4" style={{ height: '1440px' }}>
            {/* Сетка часов */}
            {timeMarkers.slice(0, 24).map(({ hour, position }) => (
              <div
                key={hour}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${position}px` }}
              />
            ))}

            {/* Активности */}
            {activityLayouts.map(({ activity, top, height, left, width }) => {
              // Пропускаем активности, которые выходят за пределы дня
              if (top < 0 || top > 1440) return null;
              
              return (
                <div
                  key={activity.id}
                  className={`absolute ${activity.color} rounded-lg p-2 border border-gray-200 shadow-sm`}
                  style={{ 
                    top: `${Math.max(0, top)}px`, 
                    height: `${Math.min(height, 1440 - Math.max(0, top))}px`,
                    left: `${left}%`,
                    width: `${width - 1}%`, // -1% для небольшого отступа между блоками
                    minHeight: '60px'
                  }}
                >
                  <div className="flex items-start justify-between h-full">
                    <div className="flex items-start space-x-1 flex-1 min-w-0">
                      <Checkbox 
                        checked={activity.completed}
                        className="w-3 h-3 rounded-sm mt-1 flex-shrink-0"
                      />
                      <div className="flex flex-col space-y-1 min-w-0 flex-1">
                        <span className="font-medium text-xs truncate">{activity.name}</span>
                        
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <span className="font-medium text-xs">{activity.startTime}-{activity.endTime}</span>
                          <div className="flex items-center">
                            {Array.from({ length: Math.min(activity.importance, 3) }, (_, i) => (
                              <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{activity.emoji}</span>
                          {activity.type === 'восстановление' && activity.needEmoji && (
                            <span className="text-xs">{activity.needEmoji}</span>
                          )}
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {activity.type.slice(0, 4)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1 flex-shrink-0">
                      <Button size="icon" variant="ghost" className="h-4 w-4">
                        <Info className="w-2 h-2" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-4 w-4">
                        <Edit className="w-2 h-2" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-4 w-4">
                        <Trash2 className="w-2 h-2 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Индикатор текущего времени */}
            <div
              className="absolute left-0 right-4 h-0.5 bg-red-500 z-10"
              style={{
                top: `${(new Date().getHours() * 60 + new Date().getMinutes())}px`
              }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full -translate-y-1 -translate-x-1"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayView;
