import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Moon, Heart, Brain, Target, Activity } from 'lucide-react';
import { DiaryEntry, StatusColorMap } from './types';

const ActiveDiariesComponent = () => {
  const activeDiaries: DiaryEntry[] = useMemo(() => [
    {
      name: 'Дневник настроения',
      icon: Heart,
      status: 'completed',
      lastEntry: 'Сегодня, 14:30',
      streak: 7
    },
    {
      name: 'Дневник сна',
      icon: Moon,
      status: 'pending',
      lastEntry: 'Вчера, 22:15',
      streak: 3
    },
    {
      name: 'Дневник мыслей',
      icon: Brain,
      status: 'pending',
      lastEntry: '2 дня назад',
      streak: 12
    },
    {
      name: 'Дневник прокрастинации',
      icon: Target,
      status: 'available',
      lastEntry: 'Никогда',
      streak: 0
    },
    {
      name: 'Дневник самооценки',
      icon: Activity,
      status: 'available',
      lastEntry: 'Неделю назад',
      streak: 2
    }
  ], []);

  const getStatusColor = useMemo(() => {
    const statusColors: StatusColorMap = {
      completed: 'bg-success/20 text-success border-success/30',
      pending: 'bg-warning/20 text-warning border-warning/30',
      available: 'bg-muted text-muted-foreground border-border'
    };
    return (status: DiaryEntry['status']) => statusColors[status];
  }, []);

  const getStatusText = useMemo(() => (status: DiaryEntry['status']) => {
    const statusTexts = {
      completed: 'Завершен',
      pending: 'Ожидает',
      available: 'Доступен'
    } as const;
    return statusTexts[status];
  }, []);

  return (
    <Card className="h-[600px] bg-background/80 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Активные дневники
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-y-auto">
        {activeDiaries.map((diary, index) => {
          const IconComponent = diary.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{diary.name}</h4>
                  <p className="text-xs text-muted-foreground">{diary.lastEntry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {diary.streak > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {diary.streak} дней
                  </Badge>
                )}
                <Badge className={`text-xs ${getStatusColor(diary.status)}`}>
                  {getStatusText(diary.status)}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActiveDiariesComponent;