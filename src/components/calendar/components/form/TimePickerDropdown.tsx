
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TimePickerDropdownProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (time: string) => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const TimePickerDropdown: React.FC<TimePickerDropdownProps> = ({
  open,
  onClose,
  value,
  onChange,
  triggerRef
}) => {
  const [timeInMinutes, setTimeInMinutes] = useState(540); // 09:00 в минутах
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Генерируем временные интервалы с шагом 5 минут (0:00 - 23:55)
  const totalMinutesInDay = 24 * 60;
  
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const timeToMinutes = (time: string) => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };

  useEffect(() => {
    if (open && value) {
      setTimeInMinutes(timeToMinutes(value));
    }
  }, [open, value]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 280;
      const dropdownHeight = 200;
      
      let top = rect.bottom + 4;
      let left = rect.left;
      
      // Проверяем, не выходит ли дропдаун за границы viewport
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 10;
      }
      
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 4;
      }
      
      setPosition({ top, left });
    }
  }, [open, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  const handleTimeSelect = () => {
    const time = minutesToTime(timeInMinutes);
    onChange(time);
    onClose();
  };

  const handleSliderChange = (values: number[]) => {
    // Округляем до ближайших 5 минут
    const roundedMinutes = Math.round(values[0] / 5) * 5;
    setTimeInMinutes(roundedMinutes);
  };

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: position.top,
        left: position.left,
        width: '280px'
      }}
    >
      <div className="p-4">
        {/* Выбранное время */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-emerald-600">
            {minutesToTime(timeInMinutes)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Выберите время
          </div>
        </div>

        {/* Вертикальный слайдер времени */}
        <div className="mb-4 px-2">
          <Slider
            value={[timeInMinutes]}
            onValueChange={handleSliderChange}
            max={totalMinutesInDay - 5}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:55</span>
          </div>
        </div>

        {/* Быстрый выбор */}
        <div className="grid grid-cols-4 gap-1 mb-4">
          {[0, 360, 540, 720, 1080, 1200, 1320, 1380].map((mins) => (
            <Button
              key={mins}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setTimeInMinutes(mins)}
            >
              {minutesToTime(mins)}
            </Button>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleTimeSelect}
          >
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerDropdown;
