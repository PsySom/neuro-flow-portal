
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

  // Создаем дополнительные записи для активностей, пересекающих полночь
  const activities: Activity[] = [...baseActivities];
  
  // Добавляем отдельную запись сна для утреннего времени
  const sleepActivity = baseActivities.find(a => a.id === 1);
  if (sleepActivity) {
    activities.push({
      ...sleepActivity,
      id: 18, // Уникальный ID для утреннего блока сна
      name: 'Сон (утро)',
      startTime: '00:00',
      endTime: '08:00',
      duration: '8 ч'
    });
  }

  // Сортируем активности по времени начала
  activities.sort((a, b) => {
    const timeA = a.startTime.split(':').map(Number);
    const timeB = b.startTime.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

  const currentTimeString = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
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

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className={`${activity.color} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox 
                    checked={activity.completed}
                    className="w-6 h-6 rounded-sm mt-1"
                  />
                  <div className="flex flex-col space-y-2">
                    <span className="font-medium text-lg">{activity.name}</span>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-medium">[{activity.startTime}-{activity.endTime}]</span>
                      <span>[{activity.duration}]</span>
                      <div className="flex items-center">
                        {Array.from({ length: activity.importance }, (_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{activity.emoji}</span>
                      {activity.type === 'восстановление' && activity.needEmoji && (
                        <span className="text-lg">{activity.needEmoji}</span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayView;
