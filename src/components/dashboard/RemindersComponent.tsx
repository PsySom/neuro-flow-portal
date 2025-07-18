import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Coffee, Dumbbell, Book, Sunrise, Heart, Droplets } from 'lucide-react';

const RemindersComponent = () => {
  const reminders = [
    {
      title: 'Утренняя медитация',
      time: '07:00',
      icon: Sunrise,
      type: 'routine',
      status: 'completed'
    },
    {
      title: 'Выпить стакан воды',
      time: '09:00',
      icon: Droplets,
      type: 'care',
      status: 'pending'
    },
    {
      title: 'Кофе-брейк',
      time: '11:00',
      icon: Coffee,
      type: 'routine',
      status: 'upcoming'
    },
    {
      title: 'Физическая активность',
      time: '18:00',
      icon: Dumbbell,
      type: 'care',
      status: 'upcoming'
    },
    {
      title: 'Чтение перед сном',
      time: '21:30',
      icon: Book,
      type: 'routine',
      status: 'upcoming'
    },
    {
      title: 'Проверка самочувствия',
      time: '20:00',
      icon: Heart,
      type: 'care',
      status: 'upcoming'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30';
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'routine':
        return 'bg-primary/10 text-primary';
      case 'care':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'routine':
        return 'Рутина';
      case 'care':
        return 'Забота';
      default:
        return 'Другое';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Выполнено';
      case 'pending':
        return 'Просрочено';
      default:
        return 'Запланировано';
    }
  };

  return (
    <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Напоминания, рутины, заботы
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 h-full overflow-y-auto">
        {reminders.map((reminder, index) => {
          const IconComponent = reminder.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(reminder.type)}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{reminder.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{reminder.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {getTypeText(reminder.type)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(reminder.status)}`}>
                {getStatusText(reminder.status)}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RemindersComponent;