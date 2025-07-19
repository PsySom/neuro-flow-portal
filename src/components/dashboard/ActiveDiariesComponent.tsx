import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Play, Pause, Square, Bell } from 'lucide-react';
import { useDiaryStatus } from '@/contexts/DiaryStatusContext';

const ActiveDiariesComponent = () => {
  const { activeDiaries, updateDiaryStatus, removeDiary } = useDiaryStatus();
  const [deactivatingDiary, setDeactivatingDiary] = useState<any>(null);

  const handlePause = (diary: any) => {
    const updatedStatus = { ...diary, isPaused: !diary.isPaused };
    updateDiaryStatus(diary.path, updatedStatus, {
      title: diary.title,
      emoji: diary.emoji,
      description: diary.description,
      color: diary.color,
      path: diary.path
    });
  };

  const handleDeactivate = (diary: any) => {
    removeDiary(diary.path);
    setDeactivatingDiary(null);
  };

  const getNextReminderText = (diary: any) => {
    // Простая логика для демонстрации - в реальном приложении это должно быть более сложно
    if (diary.scheduledDate) {
      const scheduled = new Date(diary.scheduledDate);
      const today = new Date();
      if (scheduled.toDateString() === today.toDateString()) {
        return "Сегодня";
      } else if (scheduled.getTime() > today.getTime()) {
        return formatDate(diary.scheduledDate);
      }
    }
    
    // Если нет запланированной даты, показываем рекомендуемое время
    const lastEntry = diary.lastEntryDate ? new Date(diary.lastEntryDate) : new Date();
    const nextRecommended = new Date(lastEntry);
    nextRecommended.setDate(nextRecommended.getDate() + 1);
    
    if (nextRecommended.toDateString() === new Date().toDateString()) {
      return "Сегодня";
    }
    return "Завтра";
  };

  const getStatusBadge = (diary: any) => {
    if (diary.isPaused) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Пауза</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Активен</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Никогда';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <Card className="h-[600px] bg-background/80 backdrop-blur-sm border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Активные дневники
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 h-full overflow-y-auto">
        {activeDiaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm text-center">Нет активных дневников</p>
            <p className="text-xs text-center opacity-75">Активируйте дневники в разделе "Дневники"</p>
          </div>
        ) : (
          activeDiaries.map((diary, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <span className="text-lg">{diary.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">{diary.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    Последняя запись: {formatDate(diary.lastEntryDate)}
                  </p>
                  {diary.scheduledDate && (
                    <p className="text-xs text-blue-600">
                      Запланировано: {formatDate(diary.scheduledDate)}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <Bell className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">
                      Напоминание: {getNextReminderText(diary)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(diary)}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePause(diary)}
                    className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-700"
                    title={diary.isPaused ? "Возобновить" : "Приостановить"}
                  >
                    {diary.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                        title="Отключить дневник"
                        onClick={() => setDeactivatingDiary(diary)}
                      >
                        <Square className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Отключить дневник</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены что хотите отключить этот дневник? 
                          <br />
                          <br />
                          Все сделанные записи будут сохранены и учтены при рекомендациях.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeactivatingDiary(null)}>
                          Нет
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeactivate(deactivatingDiary)}>
                          Да
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveDiariesComponent;