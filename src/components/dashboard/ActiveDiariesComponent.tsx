import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Play, Pause, Square, Bell, Calendar as CalendarIcon } from 'lucide-react';
import { useDiaryStatus } from '@/contexts/DiaryStatusContext';
import MoodDiaryModal from '../diaries/MoodDiaryModal';

const ActiveDiariesComponent = () => {
  const { activeDiaries, updateDiaryStatus, removeDiary } = useDiaryStatus();
  const [deactivatingDiary, setDeactivatingDiary] = useState<any>(null);
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const [showMoodDiary, setShowMoodDiary] = useState(false);

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

  const handlePlayDiary = (diary: any) => {
    setSelectedDiary(diary);
    if (diary.path === '/mood-diary') {
      setShowMoodDiary(true);
    }
  };

  const handleDiaryComplete = () => {
    if (selectedDiary) {
      // Обновляем дату последней записи
      const updatedStatus = { 
        ...selectedDiary, 
        lastEntryDate: new Date().toISOString().split('T')[0] 
      };
      updateDiaryStatus(selectedDiary.path, updatedStatus, {
        title: selectedDiary.title,
        emoji: selectedDiary.emoji,
        description: selectedDiary.description,
        color: selectedDiary.color,
        path: selectedDiary.path,
        config: selectedDiary.config
      });
    }
    setSelectedDiary(null);
  };

  const getDaysRemaining = (diary: any) => {
    if (!diary.config || !diary.config.activationDate) return null;
    
    const activationDate = new Date(diary.config.activationDate);
    const endDate = new Date(activationDate);
    endDate.setDate(endDate.getDate() + diary.config.fillDays);
    
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const getNextEntryTime = (diary: any) => {
    if (!diary.config || !diary.config.fillingTimes.length) return 'Не настроено';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const timeStr of diary.config.fillingTimes) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (timeInMinutes > currentTime) {
        return timeStr;
      }
    }
    
    // Если все времена прошли, возвращаем первое время завтра
    return `Завтра в ${diary.config.fillingTimes[0]}`;
  };

  const getNextReminderTime = (diary: any) => {
    if (!diary.config || !diary.config.reminderTimes.length) return 'Не настроено';
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const timeStr of diary.config.reminderTimes) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (timeInMinutes > currentTime) {
        return timeStr;
      }
    }
    
    return `Завтра в ${diary.config.reminderTimes[0]}`;
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
              className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors space-y-3"
            >
              {/* Заголовок и большая кнопка Play */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <span className="text-lg">{diary.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{diary.title}</h4>
                    {getStatusBadge(diary)}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => handlePlayDiary(diary)}
                  disabled={diary.isPaused}
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                  title="Заполнить дневник"
                >
                  <Play className="h-6 w-6 text-primary-foreground" />
                </Button>
              </div>

              {/* Информация о дневнике */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Активирован:</span>
                  </div>
                  <span className="font-medium">
                    {diary.config?.activationDate ? formatDate(diary.config.activationDate) : formatDate(diary.scheduledDate)}
                  </span>
                </div>
                
                {diary.config && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Осталось дней:</span>
                    </div>
                    <span className="font-medium">{getDaysRemaining(diary)}</span>
                  </div>
                )}
              </div>

              {diary.config && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Записей в день:</span>
                    <span className="font-medium">{diary.config.entriesPerDay}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Следующая запись:</span>
                    <span className="font-medium">{getNextEntryTime(diary)}</span>
                  </div>
                </div>
              )}

              <div className="text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Bell className="h-3 w-3 text-orange-500" />
                  <span className="text-muted-foreground">Напоминание:</span>
                </div>
                <span className="font-medium text-orange-600">
                  {diary.config ? getNextReminderTime(diary) : getNextReminderText(diary)}
                </span>
              </div>

              <div className="text-xs">
                <span className="text-muted-foreground">Последняя запись: </span>
                <span className="font-medium">{formatDate(diary.lastEntryDate)}</span>
              </div>

              {/* Кнопки управления */}
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePause(diary)}
                  className="flex-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  {diary.isPaused ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                  {diary.isPaused ? 'Возобновить' : 'Пауза'}
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeactivatingDiary(diary)}
                    >
                      <Square className="h-3 w-3 mr-1" />
                      Отключить
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
          ))
        )}
      </CardContent>

      {/* Модальное окно дневника настроения */}
      <MoodDiaryModal
        open={showMoodDiary}
        onOpenChange={setShowMoodDiary}
        onComplete={handleDiaryComplete}
      />
    </Card>
  );
};

export default ActiveDiariesComponent;