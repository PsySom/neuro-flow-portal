
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormErrors } from './validationUtils';
import TimePickerDropdown from './TimePickerDropdown';

interface TimeInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
  errorKey: keyof FormErrors;
  required?: boolean;
}

const TimeInputField: React.FC<TimeInputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  errors,
  setErrors,
  errorKey,
  required = true
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timeButtonRef = useRef<HTMLButtonElement>(null);

  const handleTimeChange = (time: string) => {
    onChange(time);
    if (errors[errorKey] && time) {
      setErrors({ ...errors, [errorKey]: '', timeLogic: '' });
    }
  };

  const handleTimeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTimePicker(!showTimePicker);
  };

  const hasError = errors[errorKey] || errors.timeLogic;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={id}
            type="time"
            value={value}
            onChange={(e) => handleTimeChange(e.target.value)}
            className={cn("pl-10", hasError ? 'border-red-500' : '')}
          />
          <Button
            ref={timeButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
            onClick={handleTimeClick}
          >
            <Clock className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        {errors[errorKey] && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors[errorKey]}
          </div>
        )}
      </div>

      <TimePickerDropdown
        open={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        value={value}
        onChange={handleTimeChange}
        triggerRef={timeButtonRef}
      />
    </>
  );
};

export default TimeInputField;
