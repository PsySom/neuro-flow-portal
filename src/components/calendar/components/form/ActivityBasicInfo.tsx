
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { FormErrors } from './validationUtils';

interface ActivityBasicInfoProps {
  activityName: string;
  setActivityName: (value: string) => void;
  activityType: string;
  setActivityType: (value: string) => void;
  errors: FormErrors;
  setErrors: (errors: FormErrors) => void;
}

const activityTypes = [
  { value: 'восстановление', label: 'Восстанавливающая (забота о себе и своих потребностях, отдых)' },
  { value: 'нейтральная', label: 'Нейтральная' },
  { value: 'смешанная', label: 'Смешанная' },
  { value: 'задача', label: 'Истощающая (дела)' },
];

const ActivityBasicInfo: React.FC<ActivityBasicInfoProps> = ({
  activityName,
  setActivityName,
  activityType,
  setActivityType,
  errors,
  setErrors
}) => {
  return (
    <>
      {/* Название активности */}
      <div className="space-y-2">
        <Label htmlFor="activity-name" className="flex items-center">
          Название активности
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input
          id="activity-name"
          value={activityName}
          onChange={(e) => {
            setActivityName(e.target.value);
            if (errors.activityName && e.target.value.trim()) {
              setErrors({ ...errors, activityName: '' });
            }
          }}
          placeholder="Введите название активности..."
          className={errors.activityName ? 'border-red-500' : ''}
        />
        {errors.activityName && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.activityName}
          </div>
        )}
      </div>

      {/* Тип активности */}
      <div className="space-y-2">
        <Label className="flex items-center">
          Тип активности
          <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select 
          value={activityType} 
          onValueChange={(value) => {
            setActivityType(value);
            if (errors.activityType && value) {
              setErrors({ ...errors, activityType: '' });
            }
          }}
        >
          <SelectTrigger className={errors.activityType ? 'border-red-500' : ''}>
            <SelectValue placeholder="Выберите тип активности..." />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.activityType && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.activityType}
          </div>
        )}
      </div>
    </>
  );
};

export default ActivityBasicInfo;
