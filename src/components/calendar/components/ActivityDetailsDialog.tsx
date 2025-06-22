import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Star, Clock, Repeat, Bell, Palette, Mic } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Activity } from '../types';

interface ActivityDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity;
  onActivityUpdate?: (activity: Activity) => void;
  onDelete?: (id: number) => void;
}

const ActivityDetailsDialog: React.FC<ActivityDetailsDialogProps> = ({
  open,
  onOpenChange,
  activity,
  onActivityUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Edit tab state
  const [activityName, setActivityName] = useState(activity.name);
  const [activityType, setActivityType] = useState(activity.type);
  const [startTime, setStartTime] = useState(activity.startTime);
  const [endTime, setEndTime] = useState(activity.endTime);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState(activity.importance);
  const [repeatType, setRepeatType] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedColor, setSelectedColor] = useState(activity.color);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(activity.completed ? 'completed' : 'pending');

  // Evaluate tab state
  const [satisfaction, setSatisfaction] = useState([5]);
  const [processSatisfaction, setProcessSatisfaction] = useState([5]);
  const [fatigue, setFatigue] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [evaluationNote, setEvaluationNote] = useState('');

  const activityTypes = [
    { value: 'восстановление', label: 'Восстанавливающая (забота о себе и своих потребностях, отдых)' },
    { value: 'нейтральная', label: 'Нейтральная' },
    { value: 'смешанная', label: 'Смешанная' },
    { value: 'задача', label: 'Истощающая (дела)' },
  ];

  const repeatOptions = [
    { value: 'daily', label: 'Ежедневно' },
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'monthly', label: 'Ежемесячно' },
  ];

  const reminderOptions = [
    { value: '5', label: 'За 5 минут' },
    { value: '15', label: 'За 15 минут' },
    { value: '30', label: 'За 30 минут' },
    { value: '60', label: 'За час' },
  ];

  const colorOptions = [
    'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200',
    'bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200',
    'bg-gray-200', 'bg-emerald-200', 'bg-teal-200', 'bg-cyan-200'
  ];

  const handleSave = () => {
    const updatedActivity: Activity = {
      ...activity,
      name: activityName.trim(),
      type: activityType,
      startTime,
      endTime,
      importance: priority,
      color: selectedColor,
      completed: status === 'completed'
    };

    if (onActivityUpdate) {
      onActivityUpdate(updatedActivity);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(activity.id);
    }
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const handleEvaluationSave = () => {
    console.log('Saving evaluation:', {
      satisfaction: satisfaction[0],
      processSatisfaction: processSatisfaction[0],
      fatigue: fatigue[0],
      stress: stress[0],
      evaluationNote
    });
  };

  const handleGoToDiary = () => {
    console.log('Navigate to diary');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {activity.name}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit">Создать/редактировать активность</TabsTrigger>
              <TabsTrigger value="evaluate">Оценить активность</TabsTrigger>
              <TabsTrigger value="development">В разработке</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-6">
              <div className="space-y-6">
                {/* Название активности */}
                <div className="space-y-2">
                  <Label htmlFor="activity-name">Название активности</Label>
                  <Input
                    id="activity-name"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="Введите название активности..."
                  />
                </div>

                {/* Тип активности */}
                <div className="space-y-2">
                  <Label>Тип активности</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип активности..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Время начала и окончания */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Время начала</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Время окончания</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Выбор даты */}
                <div className="space-y-2">
                  <Label>Дата</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ru }) : "Выберите дату..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Приоритет */}
                <div className="space-y-2">
                  <Label>Приоритет</Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-6 h-6 cursor-pointer transition-colors",
                          star <= priority
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        )}
                        onClick={() => setPriority(star)}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({priority} из 5)</span>
                  </div>
                </div>

                {/* Настройка повторения */}
                <div className="space-y-2">
                  <Label>Настройка повторения</Label>
                  <Select value={repeatType} onValueChange={setRepeatType}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Repeat className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Без повторения" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {repeatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Установка напоминаний */}
                <div className="space-y-2">
                  <Label>Напоминание</Label>
                  <Select value={reminder} onValueChange={setReminder}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Без напоминания" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {reminderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Выбор цвета */}
                <div className="space-y-2">
                  <Label>Цвет блока</Label>
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-gray-400" />
                    <div className="grid grid-cols-6 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            color,
                            selectedColor === color
                              ? "border-gray-800 scale-110"
                              : "border-gray-300 hover:border-gray-600"
                          )}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Заметка */}
                <div className="space-y-2">
                  <Label htmlFor="note">Заметка</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Добавьте заметку к активности..."
                    rows={3}
                  />
                </div>

                {/* Статус */}
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={status === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatus('completed')}
                    >
                      Выполнено
                    </Button>
                    <Button
                      variant={status === 'in-progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatus('in-progress')}
                    >
                      В процессе
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteClick}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>

                {/* Кнопка сохранить */}
                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                    Сохранить изменения
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluate" className="mt-6">
              <div className="space-y-6">
                {/* Краткая информация об активности */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Информация об активности</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{activity.emoji}</span>
                        <span className="font-medium">{activity.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>{activity.startTime}-{activity.endTime} • {activity.duration} • </span>
                        <div className="inline-flex items-center">
                          {Array.from({ length: activity.importance }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.type === 'восстановление' ? 'Восстанавливающая активность' : 
                         activity.type === 'задача' ? 'Истощающая активность' : 
                         `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} активность`}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Шкалы оценки */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Оценка активности</h3>
                  
                  {/* Удовлетворенность результатом */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Удовлетворенность результатом</Label>
                      <span className="text-sm font-medium bg-emerald-100 px-2 py-1 rounded">
                        {satisfaction[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={satisfaction}
                      onValueChange={setSatisfaction}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Совсем не удовлетворен</span>
                      <span>Полностью удовлетворен</span>
                    </div>
                  </div>

                  {/* Удовлетворенность процессом */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Удовлетворенность процессом</Label>
                      <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">
                        {processSatisfaction[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={processSatisfaction}
                      onValueChange={setProcessSatisfaction}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Процесс не понравился</span>
                      <span>Процесс очень понравился</span>
                    </div>
                  </div>

                  {/* Усталость/восстановление */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Усталость/восстановление</Label>
                      <span className="text-sm font-medium bg-purple-100 px-2 py-1 rounded">
                        {fatigue[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={fatigue}
                      onValueChange={setFatigue}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Очень устал</span>
                      <span>Полностью восстановился</span>
                    </div>
                  </div>

                  {/* Стресс/тревога */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Стресс/тревога</Label>
                      <span className="text-sm font-medium bg-red-100 px-2 py-1 rounded">
                        {stress[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={stress}
                      onValueChange={setStress}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Нет стресса</span>
                      <span>Сильный стресс</span>
                    </div>
                  </div>
                </div>

                {/* Кнопка сохранить оценку */}
                <div className="flex justify-end">
                  <Button onClick={handleEvaluationSave} className="bg-emerald-600 hover:bg-emerald-700">
                    Сохранить оценку
                  </Button>
                </div>

                {/* Заметка */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Оставить заметку</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="evaluation-note">Заметка</Label>
                    <div className="relative">
                      <Textarea
                        id="evaluation-note"
                        value={evaluationNote}
                        onChange={(e) => setEvaluationNote(e.target.value)}
                        placeholder="Поделитесь своими мыслями об активности..."
                        rows={4}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8"
                        title="Голосовой ввод"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleEvaluationSave} variant="outline">
                      Сохранить заметку
                    </Button>
                    <Button onClick={handleGoToDiary} className="bg-purple-600 hover:bg-purple-700">
                      Перейти в дневник самооценки и мыслей
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="development" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">В разработке</h3>
                <p className="text-gray-600">Эта функция находится в разработке и будет доступна в ближайшее время.</p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить активность?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить активность "{activity.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActivityDetailsDialog;
