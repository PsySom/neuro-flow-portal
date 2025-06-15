
import React from 'react';
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
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.startTime && e.target.value) {
                  setErrors({ ...errors, startTime: '', timeLogic: '' });
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
                  setErrors({ ...errors, endTime: '', timeLogic: '' });
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
    </>
  );
};

export default ActivityTimeDate;
