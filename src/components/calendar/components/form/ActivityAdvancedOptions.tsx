
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Repeat, Bell, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityAdvancedOptionsProps {
  priority: number;
  setPriority: (value: number) => void;
  repeatType: string;
  setRepeatType: (value: string) => void;
  reminder: string;
  setReminder: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
}

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

const ActivityAdvancedOptions: React.FC<ActivityAdvancedOptionsProps> = ({
  priority,
  setPriority,
  repeatType,
  setRepeatType,
  reminder,
  setReminder,
  selectedColor,
  setSelectedColor,
  note,
  setNote
}) => {
  return (
    <>
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
    </>
  );
};

export default ActivityAdvancedOptions;
