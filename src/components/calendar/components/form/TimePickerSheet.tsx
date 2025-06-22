
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

interface TimePickerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (time: string) => void;
  title: string;
}

const TimePickerSheet: React.FC<TimePickerSheetProps> = ({
  open,
  onOpenChange,
  value,
  onChange,
  title
}) => {
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // Генерируем массивы часов и минут
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Инициализируем значения при открытии
  useEffect(() => {
    if (open && value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '09');
      setSelectedMinute(minute || '00');
    }
  }, [open, value]);

  const handleSave = () => {
    const time = `${selectedHour}:${selectedMinute}`;
    onChange(time);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex gap-4 h-[200px] mb-6">
          {/* Часы */}
          <div className="flex-1">
            <div className="text-center mb-2 font-medium">Часы</div>
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-2">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`p-2 text-center cursor-pointer rounded hover:bg-gray-100 ${
                      selectedHour === hour ? 'bg-emerald-100 text-emerald-700 font-medium' : ''
                    }`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Минуты */}
          <div className="flex-1">
            <div className="text-center mb-2 font-medium">Минуты</div>
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-2">
                {minutes.filter((_, i) => i % 5 === 0).map((minute) => (
                  <div
                    key={minute}
                    className={`p-2 text-center cursor-pointer rounded hover:bg-gray-100 ${
                      selectedMinute === minute ? 'bg-emerald-100 text-emerald-700 font-medium' : ''
                    }`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Выбранное время */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-emerald-600">
            {selectedHour}:{selectedMinute}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSave}
          >
            Выбрать
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TimePickerSheet;
