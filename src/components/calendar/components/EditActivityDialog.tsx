
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Mic } from 'lucide-react';
import { Activity } from '../types';
import ActivityBasicInfo from './form/ActivityBasicInfo';
import ActivityTimeDate from './form/ActivityTimeDate';
import ActivityAdvancedOptions from './form/ActivityAdvancedOptions';
import ActivityStatus from './form/ActivityStatus';
import { validateActivityForm, getEmojiByType, calculateDuration, FormErrors, ActivityFormData } from './form/validationUtils';

interface EditActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity;
  onActivityUpdate?: (activity: Activity) => void;
  onDelete?: (id: number) => void;
}

const EditActivityDialog: React.FC<EditActivityDialogProps> = ({
  open,
  onOpenChange,
  activity,
  onActivityUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Edit tab state
  const [activityName, setActivityName] = useState(activity.name);
  const [activityType, setActivityType] = useState(activity.type);
  const [startTime, setStartTime] = useState(activity.startTime);
  const [endTime, setEndTime] = useState(activity.endTime);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [priority, setPriority] = useState(activity.importance);
  const [repeatType, setRepeatType] = useState('');
  const [reminder, setReminder] = useState('');
  const [selectedColor, setSelectedColor] = useState(activity.color);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState(activity.completed ? 'completed' : 'pending');

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Evaluate tab state
  const [satisfaction, setSatisfaction] = useState([5]);
  const [processSatisfaction, setProcessSatisfaction] = useState([5]);
  const [fatigue, setFatigue] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [evaluationNote, setEvaluationNote] = useState('');

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

    const updatedActivity: Activity = {
      ...activity,
      name: activityName.trim(),
      type: activityType,
      startTime,
      endTime,
      importance: priority,
      color: selectedColor,
      completed: status === 'completed',
      emoji: getEmojiByType(activityType),
      duration: calculateDuration(startTime, endTime)
    };

    if (onActivityUpdate) {
      onActivityUpdate(updatedActivity);
    }
    onOpenChange(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(activity.id);
    }
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const handleEvaluationSave = () => {
    console.log('Saving evaluation:', {
      satisfaction: satisfaction[0],
      processSatisfaction: processSatisfaction[0],
      fatigue: fatigue[0],
      stress: stress[0],
      evaluationNote
    });
  };

  const handleGoToDiary = () => {
    console.log('Navigate to diary');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Редактировать: {activity.name}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit">Редактировать активность</TabsTrigger>
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

                {/* Кнопки управления */}
                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteClick}
                  >
                    Удалить
                  </Button>
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                    Сохранить изменения
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluate" className="mt-6">
              <div className="space-y-6">
                {/* Краткая информация об активности */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Информация об активности</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{activity.emoji}</span>
                        <span className="font-medium">{activity.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>{activity.startTime}-{activity.endTime} • {activity.duration} • </span>
                        <div className="inline-flex items-center">
                          {Array.from({ length: activity.importance }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.type === 'восстановление' ? 'Восстанавливающая активность' : 
                         activity.type === 'задача' ? 'Истощающая активность' : 
                         `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} активность`}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Шкалы оценки */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Оценка активности</h3>
                  
                  {/* Удовлетворенность результатом */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Удовлетворенность результатом</Label>
                      <span className="text-sm font-medium bg-emerald-100 px-2 py-1 rounded">
                        {satisfaction[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={satisfaction}
                      onValueChange={setSatisfaction}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Совсем не удовлетворен</span>
                      <span>Полностью удовлетворен</span>
                    </div>
                  </div>

                  {/* Удовлетворенность процессом */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Удовлетворенность процессом</Label>
                      <span className="text-sm font-medium bg-blue-100 px-2 py-1 rounded">
                        {processSatisfaction[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={processSatisfaction}
                      onValueChange={setProcessSatisfaction}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Процесс не понравился</span>
                      <span>Процесс очень понравился</span>
                    </div>
                  </div>

                  {/* Усталость/восстановление */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Усталость/восстановление</Label>
                      <span className="text-sm font-medium bg-purple-100 px-2 py-1 rounded">
                        {fatigue[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={fatigue}
                      onValueChange={setFatigue}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Очень устал</span>
                      <span>Полностью восстановился</span>
                    </div>
                  </div>

                  {/* Стресс/тревога */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Стресс/тревога</Label>
                      <span className="text-sm font-medium bg-red-100 px-2 py-1 rounded">
                        {stress[0]}/10
                      </span>
                    </div>
                    <Slider
                      value={stress}
                      onValueChange={setStress}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Нет стресса</span>
                      <span>Сильный стресс</span>
                    </div>
                  </div>
                </div>

                {/* Кнопка сохранить оценку */}
                <div className="flex justify-end">
                  <Button onClick={handleEvaluationSave} className="bg-emerald-600 hover:bg-emerald-700">
                    Сохранить оценку
                  </Button>
                </div>

                {/* Заметка */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Оставить заметку</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="evaluation-note">Заметка</Label>
                    <div className="relative">
                      <Textarea
                        id="evaluation-note"
                        value={evaluationNote}
                        onChange={(e) => setEvaluationNote(e.target.value)}
                        placeholder="Поделитесь своими мыслями об активности..."
                        rows={4}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8"
                        title="Голосовой ввод"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleEvaluationSave} variant="outline">
                      Сохранить заметку
                    </Button>
                    <Button onClick={handleGoToDiary} className="bg-purple-600 hover:bg-purple-700">
                      Перейти в дневник самооценки и мыслей
                    </Button>
                  </div>
                </div>
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить активность?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить активность "{activity.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditActivityDialog;
