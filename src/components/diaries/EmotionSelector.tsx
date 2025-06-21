
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { emotionsData } from './moodDiaryUtils';

interface EmotionSelectorProps {
  currentMood: number;
  onEmotionsChange: (emotions: Array<{name: string; intensity: number}>) => void;
  selectedEmotions: Array<{name: string; intensity: number}>;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  currentMood,
  onEmotionsChange,
  selectedEmotions
}) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'all'>('primary');
  const [customEmotion, setCustomEmotion] = useState('');

  // Определяем приоритетную группу эмоций на основе настроения
  const getPrimaryEmotions = () => {
    if (currentMood <= -2) return emotionsData.negative;
    if (currentMood >= 2) return emotionsData.positive;
    return emotionsData.neutral;
  };

  const primaryEmotions = getPrimaryEmotions();

  const handleEmotionToggle = (emotionName: string) => {
    const isSelected = selectedEmotions.find(e => e.name === emotionName);
    
    if (isSelected) {
      // Убираем эмоцию
      const updated = selectedEmotions.filter(e => e.name !== emotionName);
      onEmotionsChange(updated);
    } else {
      // Добавляем эмоцию (максимум 3)
      if (selectedEmotions.length < 3) {
        const updated = [...selectedEmotions, { name: emotionName, intensity: 5 }];
        onEmotionsChange(updated);
      }
    }
  };

  const handleIntensityChange = (emotionName: string, intensity: number) => {
    const updated = selectedEmotions.map(emotion =>
      emotion.name === emotionName 
        ? { ...emotion, intensity }
        : emotion
    );
    onEmotionsChange(updated);
  };

  const addCustomEmotion = () => {
    if (customEmotion.trim() && selectedEmotions.length < 3) {
      const updated = [...selectedEmotions, { name: customEmotion.trim(), intensity: 5 }];
      onEmotionsChange(updated);
      setCustomEmotion('');
    }
  };

  const renderEmotionGroup = (emotions: typeof emotionsData.positive, groupName: string, bgColor: string) => (
    <div className={`p-4 rounded-lg ${bgColor} mb-4`}>
      <h4 className="font-medium mb-3 capitalize">{groupName} эмоции</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {emotions.map((emotion) => {
          const isSelected = selectedEmotions.find(e => e.name === emotion.name);
          const isDisabled = !isSelected && selectedEmotions.length >= 3;
          
          return (
            <div key={emotion.name} className="flex items-center space-x-2">
              <Checkbox
                id={emotion.name}
                checked={!!isSelected}
                onCheckedChange={() => handleEmotionToggle(emotion.name)}
                disabled={isDisabled}
              />
              <label
                htmlFor={emotion.name}
                className={`text-sm flex items-center space-x-1 cursor-pointer ${
                  isDisabled ? 'opacity-50' : ''
                }`}
              >
                <span>{emotion.emoji}</span>
                <span>{emotion.name}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tabs для выбора группы эмоций */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={activeTab === 'primary' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('primary')}
        >
          Основные
        </Button>
        <Button
          type="button"
          variant={activeTab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('all')}
        >
          Все эмоции
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Выберите до 3-х эмоций, которые наиболее точно описывают ваше состояние
      </p>

      {/* Основные эмоции или все группы */}
      {activeTab === 'primary' ? (
        renderEmotionGroup(
          primaryEmotions,
          currentMood <= -2 ? 'негативные' : currentMood >= 2 ? 'позитивные' : 'нейтральные',
          currentMood <= -2 ? 'bg-blue-50' : currentMood >= 2 ? 'bg-yellow-50' : 'bg-gray-50'
        )
      ) : (
        <div className="space-y-4">
          {renderEmotionGroup(emotionsData.positive, 'позитивные', 'bg-yellow-50')}
          {renderEmotionGroup(emotionsData.neutral, 'нейтральные', 'bg-gray-50')}
          {renderEmotionGroup(emotionsData.negative, 'негативные', 'bg-blue-50')}
        </div>
      )}

      {/* Добавление своей эмоции */}
      <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg">
        <Label className="text-sm font-medium">Добавить свою эмоцию:</Label>
        <div className="flex space-x-2 mt-2">
          <Input
            placeholder="Название эмоции"
            value={customEmotion}
            onChange={(e) => setCustomEmotion(e.target.value)}
            disabled={selectedEmotions.length >= 3}
          />
          <Button
            type="button"
            size="sm"
            onClick={addCustomEmotion}
            disabled={!customEmotion.trim() || selectedEmotions.length >= 3}
          >
            Добавить
          </Button>
        </div>
      </div>

      {/* Настройка интенсивности выбранных эмоций */}
      {selectedEmotions.length > 0 && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Интенсивность эмоций</h4>
          {selectedEmotions.map((emotion) => (
            <div key={emotion.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center space-x-2">
                  <span>{emotion.name}</span>
                  <span className="text-lg">
                    {emotion.intensity >= 8 ? '🔥' : emotion.intensity >= 6 ? '⚡' : emotion.intensity >= 4 ? '💫' : '✨'}
                  </span>
                </Label>
                <span className="text-sm font-medium">{emotion.intensity}/10</span>
              </div>
              <Slider
                value={[emotion.intensity]}
                onValueChange={(value) => handleIntensityChange(emotion.name, value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
