
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PreferencesScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onNext, onBack }) => {
  const [timeCommitment, setTimeCommitment] = useState('');
  const [reminderFrequency, setReminderFrequency] = useState('');
  const [structurePreference, setStructurePreference] = useState('');

  const handleSubmit = () => {
    onNext({
      timeCommitment,
      reminderFrequency,
      structurePreference
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={100} className="mb-4" />
        <p className="text-sm text-gray-500">8 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Несколько вопросов о ваших предпочтениях
      </h2>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Сколько времени в день вы готовы уделять заботе о себе?
          </Label>
          <RadioGroup value={timeCommitment} onValueChange={setTimeCommitment}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5-10" id="time-5-10" />
              <Label htmlFor="time-5-10">5-10 минут</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="15-20" id="time-15-20" />
              <Label htmlFor="time-15-20">15-20 минут</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30-45" id="time-30-45" />
              <Label htmlFor="time-30-45">30-45 минут</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60+" id="time-60" />
              <Label htmlFor="time-60">Час и больше</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как часто вы хотели бы получать напоминания?
          </Label>
          <RadioGroup value={reminderFrequency} onValueChange={setReminderFrequency}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-2" id="reminders-1-2" />
              <Label htmlFor="reminders-1-2">1-2 раза в день</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3-4" id="reminders-3-4" />
              <Label htmlFor="reminders-3-4">3-4 раза в день</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="as-needed" id="reminders-as-needed" />
              <Label htmlFor="reminders-as-needed">По необходимости</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal" id="reminders-minimal" />
              <Label htmlFor="reminders-minimal">Минимум напоминаний</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Предпочитаете ли вы структурированный подход?
          </Label>
          <RadioGroup value={structurePreference} onValueChange={setStructurePreference}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structured" id="structure-yes" />
              <Label htmlFor="structure-yes">Да, люблю четкие планы</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="somewhat-structured" id="structure-somewhat" />
              <Label htmlFor="structure-somewhat">Скорее да</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="structure-flexible" />
              <Label htmlFor="structure-flexible">Скорее нет, предпочитаю гибкость</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="structure-free" />
              <Label htmlFor="structure-free">Нет, хочу полную свободу</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!timeCommitment || !reminderFrequency || !structurePreference}
        >
          Завершить настройку
        </Button>
      </div>
    </div>
  );
};

export default PreferencesScreen;
