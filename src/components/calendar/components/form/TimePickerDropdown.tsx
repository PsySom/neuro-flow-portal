
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

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
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  useEffect(() => {
    if (open && value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '09');
      setSelectedMinute(minute || '00');
    }
  }, [open, value]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 200;
      const dropdownHeight = 180;
      
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

  const handleTimeSelect = (hour: string, minute: string) => {
    const time = `${hour}:${minute}`;
    onChange(time);
    onClose();
  };

  const scrollToCurrentTime = (type: 'hour' | 'minute') => {
    const currentValue = type === 'hour' ? selectedHour : selectedMinute;
    const container = dropdownRef.current?.querySelector(`[data-scroll-${type}]`);
    if (container) {
      const element = container.querySelector(`[data-value="${currentValue}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToCurrentTime('hour');
        scrollToCurrentTime('minute');
      }, 100);
    }
  }, [open, selectedHour, selectedMinute]);

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        top: position.top,
        left: position.left,
        width: '200px'
      }}
    >
      <div className="p-2">
        <div className="flex gap-2 mb-2">
          {/* Часы */}
          <div className="flex-1">
            <div className="text-center mb-1 font-medium text-xs">Часы</div>
            <ScrollArea className="h-20 border rounded">
              <div data-scroll-hour className="p-1">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    data-value={hour}
                    className={`p-1 text-center cursor-pointer rounded text-xs hover:bg-gray-100 ${
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
            <div className="text-center mb-1 font-medium text-xs">Минуты</div>
            <ScrollArea className="h-20 border rounded">
              <div data-scroll-minute className="p-1">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    data-value={minute}
                    className={`p-1 text-center cursor-pointer rounded text-xs hover:bg-gray-100 ${
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
        <div className="text-center mb-2">
          <div className="text-sm font-bold text-emerald-600">
            {selectedHour}:{selectedMinute}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleTimeSelect(selectedHour, selectedMinute)}
          >
            Выбрать
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimePickerDropdown;
