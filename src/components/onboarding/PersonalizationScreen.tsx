import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PersonalizationScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onNext, onBack, isLoading = false }) => {
  const [supportStyle, setSupportStyle] = useState('');
  const [feedbackStyle, setFeedbackStyle] = useState('');
  const [structurePreference, setStructurePreference] = useState('');

  const handleSubmit = () => {
    onNext({
      supportStyle,
      feedbackStyle,
      structurePreference
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={87.5} className="mb-4" />
        <p className="text-sm text-gray-500">14 из 16 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Персонализация поддержки
      </h2>
      <p className="text-gray-600 mb-6">
        Настроим стиль взаимодействия приложения под ваши предпочтения
      </p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как вы предпочитаете получать поддержку?
          </Label>
          <RadioGroup value={supportStyle} onValueChange={setSupportStyle}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gentle" id="support-gentle" />
              <Label htmlFor="support-gentle">Мягкая мотивация - деликатные напоминания</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friendly" id="support-friendly" />
              <Label htmlFor="support-friendly">Дружеская поддержка - теплые ободряющие сообщения</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="structured" id="support-structured" />
              <Label htmlFor="support-structured">Структурированные рекомендации - четкие советы</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inspiring" id="support-inspiring" />
              <Label htmlFor="support-inspiring">Вдохновляющий контент - цитаты и идеи для размышления</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Какой стиль обратной связи вам ближе?
          </Label>
          <RadioGroup value={feedbackStyle} onValueChange={setFeedbackStyle}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="progress-focused" id="feedback-progress" />
              <Label htmlFor="feedback-progress">Фокус на прогрессе - отмечать даже маленькие шаги</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="honest" id="feedback-honest" />
              <Label htmlFor="feedback-honest">Честная оценка - показывать реальную картину</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="effort-focused" id="feedback-effort" />
              <Label htmlFor="feedback-effort">Поощрение усилий - ценить старания, не только результат</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="practical" id="feedback-practical" />
              <Label htmlFor="feedback-practical">Практические советы - конкретные рекомендации к действию</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Как вы предпочитаете структурировать свой день?
          </Label>
          <RadioGroup value={structurePreference} onValueChange={setStructurePreference}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed-schedule" id="structure-detailed" />
              <Label htmlFor="structure-detailed">Детальное расписание по часам</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="task-list" id="structure-tasks" />
              <Label htmlFor="structure-tasks">Список основных задач на день</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible-goals" id="structure-flexible" />
              <Label htmlFor="structure-flexible">Общие цели без жесткого тайминга</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="minimal-planning" id="structure-minimal" />
              <Label htmlFor="structure-minimal">Минимальное планирование, гибкость</Label>
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
          disabled={!supportStyle || !feedbackStyle || isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationScreen;