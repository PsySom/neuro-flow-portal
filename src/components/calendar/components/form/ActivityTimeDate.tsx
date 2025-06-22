
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FormErrors } from './validationUtils';
import TimePickerDropdown from './TimePickerDropdown';

interface ActivityTimeDateProps {
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
}

const ActivityTimeDate: React.FC<ActivityTimeDateProps> = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  selectedDate,
  setSelectedDate,
  errors,
  setErrors
}) => {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const startTimeButtonRef = useRef<HTMLButtonElement>(null);
  const endTimeButtonRef = useRef<HTMLButtonElement>(null);

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (errors.startTime && time) {
      setErrors({ ...errors, startTime: '', timeLogic: '' });
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (errors.endTime && time) {
      setErrors({ ...errors, endTime: '', timeLogic: '' });
    }
  };

  return (
    <>
      {/* Время начала и окончания */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time" className="flex items-center">
            Время начала
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className={cn("pl-10", (errors.startTime || errors.timeLogic) ? 'border-red-500' : '')}
            />
            <Button
              ref={startTimeButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
              onClick={() => {
                setShowEndTimePicker(false);
                setShowStartTimePicker(true);
              }}
            >
              <Clock className="w-4 h-4 text-gray-400" />
            </Button>
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
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className={cn("pl-10", (errors.endTime || errors.timeLogic) ? 'border-red-500' : '')}
            />
            <Button
              ref={endTimeButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
              onClick={() => {
                setShowStartTimePicker(false);
                setShowEndTimePicker(true);
              }}
            >
              <Clock className="w-4 h-4 text-gray-400" />
            </Button>
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
                  setErrors({ ...errors, selectedDate: '' });
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

      {/* Time Picker Dropdowns */}
      <TimePickerDropdown
        open={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        value={startTime}
        onChange={handleStartTimeChange}
        triggerRef={startTimeButtonRef}
      />

      <TimePickerDropdown
        open={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        value={endTime}
        onChange={handleEndTimeChange}
        triggerRef={endTimeButtonRef}
      />
    </>
  );
};

export default ActivityTimeDate;
