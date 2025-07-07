
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BasicInfoProps {
  onNext: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onNext, onBack, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: [25],
    gender: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleSubmit = () => {
    onNext(formData);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={25} className="mb-4" />
        <p className="text-sm text-gray-500">2 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Расскажите немного о себе</h2>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700">Имя (как к вам обращаться)</Label>
          <Input
            placeholder="Ваше имя"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Возраст: {formData.age[0]} лет
          </Label>
          <Slider
            value={formData.age}
            onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}
            max={80}
            min={16}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Пол</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Мужской</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Женский</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Другое</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
              <Label htmlFor="prefer-not-to-say">Предпочитаю не указывать</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">Часовой пояс</Label>
          <Input
            value={formData.timezone}
            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
            className="mt-1"
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1">Определен автоматически</p>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!formData.name || isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
};

export default BasicInfo;
