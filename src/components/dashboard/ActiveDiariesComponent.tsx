import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { useDiaryStatus } from '@/contexts/DiaryStatusContext';

const ActiveDiariesComponent = () => {
  const { activeDiaries, updateDiaryStatus, removeDiary } = useDiaryStatus();

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
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(diary)}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePause(diary)}
                    className="h-6 w-6 p-0"
                  >
                    {diary.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeactivate(diary)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
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