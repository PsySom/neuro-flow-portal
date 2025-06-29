
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useActivities } from '@/contexts/ActivitiesContext';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: string;
}

interface CreateActivityFromPracticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  practiceItem: ContentItem | null;
}

const CreateActivityFromPracticeDialog: React.FC<CreateActivityFromPracticeDialogProps> = ({
  open,
  onOpenChange,
  practiceItem
}) => {
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('восстановление');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState(1);
  const [selectedColor, setSelectedColor] = useState('bg-green-200');
  const [note, setNote] = useState('');

  const { addActivity } = useActivities();
  const { toast } = useToast();

  useEffect(() => {
    if (practiceItem && open) {
      setActivityName(practiceItem.title);
      setActivityType('восстановление');
      setNote(`Упражнение: ${practiceItem.description}`);
      
      // Попробуем рассчитать время окончания на основе продолжительности
      if (startTime && practiceItem.duration) {
        const durationMatch = practiceItem.duration.match(/(\d+)/);
        if (durationMatch) {
          const minutes = parseInt(durationMatch[1]);
          const [hours, mins] = startTime.split(':').map(Number);
          const endMinutes = hours * 60 + mins + minutes;
          const endHours = Math.floor(endMinutes / 60) % 24;
          const endMins = endMinutes % 60;
          setEndTime(`${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`);
        }
      }
    }
  }, [practiceItem, open, startTime]);

  const getEmojiByType = (type: string) => {
    switch (type) {
      case 'восстановление': return '🌱';
      case 'нейтральная': return '⚪';
      case 'смешанная': return '🔄';
      case 'задача': return '💼';
      default: return '🌱';
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return '';
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours === 0) return `${minutes} мин`;
    if (minutes === 0) return `${hours} ч`;
    return `${hours} ч ${minutes} мин`;
  };

  const handleSave = () => {
    if (!activityName.trim() || !startTime || !endTime) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
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
      completed: false,
      type: activityType,
      note,
      needEmoji: activityType === 'восстановление' ? '⚡' : undefined,
      date: selectedDate.toISOString().split('T')[0]
    };

    addActivity(newActivity);
    
    toast({
      title: "Активность создана",
      description: `"${activityName}" добавлена в календарь на ${selectedDate.toLocaleDateString()}`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setActivityName('');
    setActivityType('восстановление');
    setStartTime('');
    setEndTime('');
    setSelectedDate(new Date());
    setPriority(1);
    setSelectedColor('bg-green-200');
    setNote('');
    onOpenChange(false);
  };

  const colorOptions = [
    'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200',
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-orange-200'
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Запланировать упражнение
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Название активности</Label>
            <Input
              id="name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="Введите название"
            />
          </div>

          <div>
            <Label htmlFor="type">Тип активности</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="восстановление">Восстанавливающая</SelectItem>
                <SelectItem value="нейтральная">Нейтральная</SelectItem>
                <SelectItem value="смешанная">Смешанная</SelectItem>
                <SelectItem value="задача">Истощающая</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Время начала</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Время окончания</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priority">Важность (1-5)</Label>
            <Select value={priority.toString()} onValueChange={(value) => setPriority(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Очень низкая</SelectItem>
                <SelectItem value="2">2 - Низкая</SelectItem>
                <SelectItem value="3">3 - Средняя</SelectItem>
                <SelectItem value="4">4 - Высокая</SelectItem>
                <SelectItem value="5">5 - Очень высокая</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Цвет</Label>
            <div className="flex gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 ${color} ${
                    selectedColor === color ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="note">Заметка</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Дополнительная информация"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              Запланировать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityFromPracticeDialog;
