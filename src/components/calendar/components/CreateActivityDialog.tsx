import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Star, Clock, Repeat, Bell, Palette, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTime?: string;
  onActivityCreate: (activity: any) => void;
}

const CreateActivityDialog: React.FC<CreateActivityDialogProps> = ({
  open,
  onOpenChange,
  initialTime = '',
  onActivityCreate
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  
  // Form state
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [startTime, setStartTime] = useState(initialTime);
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState(1);
  const [repeatType, setRepeatType] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-200');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('pending');

  // Validation errors
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!activityName.trim()) {
      newErrors.activityName = 'Название активности обязательно для заполнения';
    }

    if (!activityType) {
      newErrors.activityType = 'Тип активности обязателен для выбора';
    }

    if (!startTime) {
      newErrors.startTime = 'Время начала обязательно для заполнения';
    }

    if (!endTime) {
      newErrors.endTime = 'Время окончания обязательно для заполнения';
    }

    if (!selectedDate) {
      newErrors.selectedDate = 'Дата обязательна для выбора';
    }

    // Проверка логики времени
    if (startTime && endTime) {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);
      if (start >= end) {
        newErrors.timeLogic = 'Время окончания должно быть позже времени начала';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newActivity = {
      id: Date.now(),
      name: activityName.trim(),
      emoji: getEmojiByType(activityType),
      startTime,
      endTime,
      duration: calculateDuration(startTime, endTime),
      color: selectedColor,
      importance: priority,
      completed: status === 'completed',
      type: activityType,
      note,
      repeatType,
      reminder
    };

    onActivityCreate(newActivity);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setActivityName('');
    setActivityType('');
    setStartTime('');
    setEndTime('');
    setSelectedDate(new Date());
    setPriority(1);
    setRepeatType('');
    setReminder('');
    setSelectedColor('bg-blue-200');
    setNote('');
    setStatus('pending');
    setErrors({});
    onOpenChange(false);
  };

  const getEmojiByType = (type: string) => {
    switch (type) {
      case 'восстановление': return '🌱';
      case 'нейтральная': return '⚪';
      case 'смешанная': return '🔄';
      case 'задача': return '📋';
      default: return '📝';
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Создать активность
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
                <Label htmlFor="activity-name" className="flex items-center">
                  Название активности
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="activity-name"
                  value={activityName}
                  onChange={(e) => {
                    setActivityName(e.target.value);
                    if (errors.activityName && e.target.value.trim()) {
                      setErrors(prev => ({ ...prev, activityName: '' }));
                    }
                  }}
                  placeholder="Введите название активности..."
                  className={errors.activityName ? 'border-red-500' : ''}
                />
                {errors.activityName && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.activityName}
                  </div>
                )}
              </div>

              {/* Тип активности */}
              <div className="space-y-2">
                <Label className="flex items-center">
                  Тип активности
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select 
                  value={activityType} 
                  onValueChange={(value) => {
                    setActivityType(value);
                    if (errors.activityType && value) {
                      setErrors(prev => ({ ...prev, activityType: '' }));
                    }
                  }}
                >
                  <SelectTrigger className={errors.activityType ? 'border-red-500' : ''}>
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
                {errors.activityType && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.activityType}
                  </div>
                )}
              </div>

              {/* Время начала и окончания */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="flex items-center">
                    Время начала
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (errors.startTime && e.target.value) {
                          setErrors(prev => ({ ...prev, startTime: '' }));
                        }
                        if (errors.timeLogic) {
                          setErrors(prev => ({ ...prev, timeLogic: '' }));
                        }
                      }}
                      className={cn("pl-10", (errors.startTime || errors.timeLogic) ? 'border-red-500' : '')}
                    />
                  </div>
                  {errors.startTime && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.startTime}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time" className="flex items-center">
                    Время окончания
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (errors.endTime && e.target.value) {
                          setErrors(prev => ({ ...prev, endTime: '' }));
                        }
                        if (errors.timeLogic) {
                          setErrors(prev => ({ ...prev, timeLogic: '' }));
                        }
                      }}
                      className={cn("pl-10", (errors.endTime || errors.timeLogic) ? 'border-red-500' : '')}
                    />
                  </div>
                  {errors.endTime && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.endTime}
                    </div>
                  )}
                </div>
              </div>
              
              {errors.timeLogic && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.timeLogic}
                </div>
              )}

              {/* Выбор даты */}
              <div className="space-y-2">
                <Label className="flex items-center">
                  Дата
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        errors.selectedDate ? 'border-red-500' : ''
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
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (errors.selectedDate && date) {
                          setErrors(prev => ({ ...prev, selectedDate: '' }));
                        }
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.selectedDate && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.selectedDate}
                  </div>
                )}
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
                    variant={status === 'deleted' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setStatus('deleted')}
                  >
                    Удалить
                  </Button>
                </div>
              </div>

              {/* Кнопка сохранить */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Отмена
                </Button>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  Сохранить
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evaluate" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Оценка активности</h3>
              <p className="text-gray-600">Сначала создайте активность для её оценки.</p>
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
  );
};

export default CreateActivityDialog;
