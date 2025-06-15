
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Star, Clock, Repeat, Bell, Palette } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const CreateActivityTab: React.FC = () => {
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [priority, setPriority] = useState(1);
  const [repeatType, setRepeatType] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-200');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('pending');

  const activityTypes = [
    { value: 'restorative', label: 'Восстанавливающая (забота о себе и своих потребностях, отдых)' },
    { value: 'neutral', label: 'Нейтральная' },
    { value: 'mixed', label: 'Смешанная' },
    { value: 'depleting', label: 'Истощающая (дела)' },
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
    console.log('Saving activity:', {
      activityName,
      activityType,
      startTime,
      endTime,
      selectedDate,
      priority,
      repeatType,
      reminder,
      selectedColor,
      note,
      status
    });
  };

  return (
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
            variant={status === 'deleted' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setStatus('deleted')}
          >
            Удалить
          </Button>
        </div>
      </div>

      {/* Кнопка сохранить */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
          Сохранить
        </Button>
      </div>
    </div>
  );
};

export default CreateActivityTab;
