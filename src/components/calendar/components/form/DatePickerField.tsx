
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FormErrors } from './validationUtils';

interface DatePickerFieldProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
  label?: string;
  required?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  selectedDate,
  setSelectedDate,
  errors,
  setErrors,
  label = "Дата",
  required = true
}) => {
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (errors.selectedDate && date) {
      setErrors({ ...errors, selectedDate: '' });
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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
            {selectedDate && !isNaN(selectedDate.getTime()) ? format(selectedDate, "PPP", { locale: ru }) : "Выберите дату..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
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
  );
};

export default DatePickerField;
