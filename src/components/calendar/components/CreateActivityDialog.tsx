
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ActivityBasicInfo from './form/ActivityBasicInfo';
import ActivityTimeDate from './form/ActivityTimeDate';
import ActivityAdvancedOptions from './form/ActivityAdvancedOptions';
import ActivityStatus from './form/ActivityStatus';
import { validateActivityForm, getEmojiByType, calculateDuration, FormErrors, ActivityFormData } from './form/validationUtils';
import { RecurringActivityOptions } from '../utils/recurringUtils';

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTime?: string;
  initialDate?: string;
  onActivityCreate: (activity: any, recurringOptions?: RecurringActivityOptions) => void;
}

const CreateActivityDialog: React.FC<CreateActivityDialogProps> = ({
  open,
  onOpenChange,
  initialTime = '',
  initialDate,
  onActivityCreate
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  
  // Form state
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState('');
  const [startTime, setStartTime] = useState(initialTime);
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      return new Date(initialDate);
    }
    return new Date();
  });
  const [priority, setPriority] = useState(1);
  const [repeatType, setRepeatType] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-200');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('pending');

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSave = () => {
    const formData: ActivityFormData = {
      activityName,
      activityType,
      startTime,
      endTime,
      selectedDate,
      priority,
      repeatType,
      reminder,
      selectedColor,
      note,
      status
    };

    const validationErrors = validateActivityForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newActivity = {
      id: Date.now(),
      name: activityName.trim(),
      emoji: getEmojiByType(activityType),
      startTime,
      endTime,
      duration: calculateDuration(startTime, endTime),
      color: selectedColor,
      importance: priority,
      completed: status === 'completed',
      type: activityType,
      note,
      reminder,
      date: selectedDate.toISOString().split('T')[0]
    };

    // Формируем параметры повтора
    let recurringOptions: RecurringActivityOptions | undefined;
    if (repeatType && repeatType !== 'none' && repeatType !== '') {
      recurringOptions = {
        type: repeatType as 'daily' | 'weekly' | 'monthly',
        interval: 1, // каждый день/неделю/месяц
        maxOccurrences: 365 // максимум год вперед
      };
    }

    onActivityCreate(newActivity, recurringOptions);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setActivityName('');
    setActivityType('');
    setStartTime('');
    setEndTime('');
    setSelectedDate(() => {
      if (initialDate) {
        return new Date(initialDate);
      }
      return new Date();
    });
    setPriority(1);
    setRepeatType('');
    setReminder('');
    setSelectedColor('bg-blue-200');
    setNote('');
    setStatus('pending');
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Создать активность
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="edit">Создать активность</TabsTrigger>
            <TabsTrigger value="evaluate">Оценить активность</TabsTrigger>
            <TabsTrigger value="development">В разработке</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <div className="space-y-6">
              <ActivityBasicInfo
                activityName={activityName}
                setActivityName={setActivityName}
                activityType={activityType}
                setActivityType={setActivityType}
                errors={errors}
                setErrors={setErrors}
              />

              <ActivityTimeDate
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                errors={errors}
                setErrors={setErrors}
              />

              <ActivityAdvancedOptions
                priority={priority}
                setPriority={setPriority}
                repeatType={repeatType}
                setRepeatType={setRepeatType}
                reminder={reminder}
                setReminder={setReminder}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                note={note}
                setNote={setNote}
              />

              <ActivityStatus
                status={status}
                setStatus={setStatus}
              />

              {/* Кнопка сохранить */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Отмена
                </Button>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  Сохранить
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="evaluate" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Оценка активности</h3>
              <p className="text-gray-600">Сначала создайте активность для её оценки.</p>
            </div>
          </TabsContent>

          <TabsContent value="development" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">В разработке</h3>
              <p className="text-gray-600">Эта функция находится в разработке и будет доступна в ближайшее время.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityDialog;
