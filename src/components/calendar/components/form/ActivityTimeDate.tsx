
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormErrors } from './validationUtils';
import TimeInputField from './TimeInputField';
import DatePickerField from './DatePickerField';

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
        <TimeInputField
          id="start-time"
          label="Время начала"
          value={startTime}
          onChange={setStartTime}
          errors={errors}
          setErrors={setErrors}
          errorKey="startTime"
        />
        
        <TimeInputField
          id="end-time"
          label="Время окончания"
          value={endTime}
          onChange={setEndTime}
          errors={errors}
          setErrors={setErrors}
          errorKey="endTime"
        />
      </div>
      
      {errors.timeLogic && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.timeLogic}
        </div>
      )}

      {/* Выбор даты */}
      <DatePickerField
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        errors={errors}
        setErrors={setErrors}
      />
    </>
  );
};

export default ActivityTimeDate;
