
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useActivities } from '@/contexts/ActivitiesContext';
import { RecurringActivityOptions } from '@/components/calendar/utils/recurringUtils';

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateActivityDialog: React.FC<CreateActivityDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState(1);
  const [selectedColor, setSelectedColor] = useState('bg-blue-200');
  const [note, setNote] = useState('');
  const [repeatType, setRepeatType] = useState('none');

  const { addActivity, getCurrentDateString } = useActivities();

  const getEmojiByType = (type: string) => {
    switch (type) {
      case 'восстановление': return '🌱';
      case 'нейтральная': return '⚪';
      case 'смешанная': return '🔄';
      case 'задача': return '💼';
      default: return '📝';
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
    if (!activityName.trim() || !activityType || !startTime || !endTime) {
      console.log('Validation failed: missing required fields');
      return;
    }

    // Используем текущую дату для активности из дашборда
    const currentDate = getCurrentDateString();

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
      date: currentDate
    };

    // Формируем параметры повтора
    let recurringOptions: RecurringActivityOptions | undefined;
    if (repeatType && repeatType !== 'none' && repeatType !== '') {
      recurringOptions = {
        type: repeatType as 'daily' | 'weekly' | 'monthly',
        interval: 1,
        maxOccurrences: repeatType === 'daily' ? 10 : 30
      };
    }

    console.log('Creating activity from dashboard:', newActivity);
    console.log('With recurring options:', recurringOptions);
    
    addActivity(newActivity, recurringOptions);
    handleClose();
  };

  const handleClose = () => {
    setActivityName('');
    setActivityType('');
    setStartTime('');
    setEndTime('');
    setPriority(1);
    setSelectedColor('bg-blue-200');
    setNote('');
    setRepeatType('none');
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
            Создать активность
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">Создать активность</TabsTrigger>
            <TabsTrigger value="evaluate">Оценить</TabsTrigger>
            <TabsTrigger value="development">В разработке</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название активности</Label>
                <Input
                  id="name"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Введите название активности"
                />
              </div>

              <div>
                <Label htmlFor="type">Тип активности</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип активности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="восстановление">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        Восстанавливающая
                      </div>
                    </SelectItem>
                    <SelectItem value="нейтральная">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        Нейтральная
                      </div>
                    </SelectItem>
                    <SelectItem value="смешанная">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        Смешанная
                      </div>
                    </SelectItem>
                    <SelectItem value="задача">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        Истощающая
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="repeat">Настройка повторения</Label>
                <Select value={repeatType} onValueChange={setRepeatType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип повторения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не повторять</SelectItem>
                    <SelectItem value="daily">Ежедневно (10 дней)</SelectItem>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                    <SelectItem value="monthly">Ежемесячно</SelectItem>
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
                <Label htmlFor="note">Заметка (опционально)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Добавьте заметку к активности"
                />
              </div>

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
