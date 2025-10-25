import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Minus, Bell } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MoodDiaryConfig {
  entriesPerDay: number;
  fillingTimes: string[];
  reminderTimes: string[];
  activationDate: string;
  fillDays: number;
}

interface MoodDiaryConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: MoodDiaryConfig) => void;
}

const MoodDiaryConfigDialog: React.FC<MoodDiaryConfigDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [entriesPerDay, setEntriesPerDay] = useState(1);
  const [fillingTimes, setFillingTimes] = useState(['09:00']);
  const [reminderTimes, setReminderTimes] = useState(['08:45']);
  const [fillDays, setFillDays] = useState(30);

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const updateFillingTime = (index: number, time: string) => {
    const newTimes = [...fillingTimes];
    newTimes[index] = time;
    setFillingTimes(newTimes);
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const addTimeSlot = () => {
    if (entriesPerDay < 3) {
      const newEntriesCount = entriesPerDay + 1;
      setEntriesPerDay(newEntriesCount);
      
      // Добавляем время заполнения
      const lastTime = fillingTimes[fillingTimes.length - 1] || '09:00';
      const [hours, minutes] = lastTime.split(':').map(Number);
      const newHour = Math.min(hours + 6, 21);
      const newTime = `${newHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setFillingTimes([...fillingTimes, newTime]);
      
      // Добавляем время напоминания (за 15 минут до заполнения)
      const reminderHour = newHour;
      const reminderMinute = Math.max(minutes - 15, 0);
      const reminderTime = `${reminderHour.toString().padStart(2, '0')}:${reminderMinute.toString().padStart(2, '0')}`;
      setReminderTimes([...reminderTimes, reminderTime]);
    }
  };

  const removeTimeSlot = () => {
    if (entriesPerDay > 1) {
      setEntriesPerDay(entriesPerDay - 1);
      setFillingTimes(fillingTimes.slice(0, -1));
      setReminderTimes(reminderTimes.slice(0, -1));
    }
  };

  const handleSave = () => {
    const config: MoodDiaryConfig = {
      entriesPerDay,
      fillingTimes,
      reminderTimes,
      activationDate: new Date().toISOString(),
      fillDays
    };
    onSave(config);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">😊</span>
            Настройка дневника настроения
          </DialogTitle>
          <DialogDescription className="sr-only">
            Настройка параметров дневника настроения: время заполнения и напоминаний
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Количество записей в день */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Количество записей в день</Label>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={removeTimeSlot}
                disabled={entriesPerDay <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="px-4 py-2 text-lg">
                {entriesPerDay}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                disabled={entriesPerDay >= 3}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Время заполнения */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Время заполнения
            </Label>
            <div className="space-y-2">
              {fillingTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-16">
                    Запись {index + 1}:
                  </span>
                  <Select value={time} onValueChange={(value) => updateFillingTime(index, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((timeOption) => (
                        <SelectItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Время напоминания */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Время напоминания
            </Label>
            <div className="space-y-2">
              {reminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-16">
                    Напоминание {index + 1}:
                  </span>
                  <Select value={time} onValueChange={(value) => updateReminderTime(index, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((timeOption) => (
                        <SelectItem key={timeOption} value={timeOption}>
                          {timeOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Количество дней заполнения */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Количество дней заполнения</Label>
            <Select value={fillDays.toString()} onValueChange={(value) => setFillDays(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 дней</SelectItem>
                <SelectItem value="14">14 дней</SelectItem>
                <SelectItem value="30">30 дней</SelectItem>
                <SelectItem value="60">60 дней</SelectItem>
                <SelectItem value="90">90 дней</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Активировать дневник
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoodDiaryConfigDialog;