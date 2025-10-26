import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { QuestionOption } from "@/types/scenario.types";

interface EmotionWithIntensity {
  id: string;
  intensity: number;
}

interface EmotionsWithIntensityInputProps {
  value: EmotionWithIntensity[];
  onChange: (value: EmotionWithIntensity[]) => void;
  options: QuestionOption[];
  maxSelect?: number;
}

export const EmotionsWithIntensityInput = ({ 
  value, 
  onChange, 
  options, 
  maxSelect = 3 
}: EmotionsWithIntensityInputProps) => {
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionWithIntensity[]>(
    Array.isArray(value) ? value : []
  );

  const toggleEmotion = (optionId: string) => {
    const isSelected = selectedEmotions.find(e => e.id === optionId);
    
    if (isSelected) {
      const updated = selectedEmotions.filter(e => e.id !== optionId);
      setSelectedEmotions(updated);
      onChange(updated);
    } else {
      if (selectedEmotions.length < maxSelect) {
        const updated = [...selectedEmotions, { id: optionId, intensity: 5 }];
        setSelectedEmotions(updated);
        onChange(updated);
      }
    }
  };

  const handleIntensityChange = (emotionId: string, intensity: number) => {
    const updated = selectedEmotions.map(emotion =>
      emotion.id === emotionId 
        ? { ...emotion, intensity }
        : emotion
    );
    setSelectedEmotions(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Выбрано: {selectedEmotions.length} / {maxSelect}
        </p>
        <div className="flex flex-wrap gap-2">
          {options.map(option => {
            const isSelected = selectedEmotions.find(e => e.id === option.id);
            const isDisabled = !isSelected && selectedEmotions.length >= maxSelect;
            
            return (
              <Button
                key={option.id}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleEmotion(option.id)}
                disabled={isDisabled}
                className="h-auto py-2 px-3"
              >
                {option.emoji && <span className="mr-1.5 text-base">{option.emoji}</span>}
                <span className="text-xs">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {selectedEmotions.length > 0 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <h4 className="font-medium text-sm">Интенсивность эмоций</h4>
          {selectedEmotions.map((emotion) => {
            const option = options.find(o => o.id === emotion.id);
            if (!option) return null;
            
            return (
              <div key={emotion.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2 text-sm">
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                    <span className="text-lg">
                      {emotion.intensity >= 8 ? '🔥' : emotion.intensity >= 6 ? '⚡' : emotion.intensity >= 4 ? '💫' : '✨'}
                    </span>
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {emotion.intensity}/10
                  </Badge>
                </div>
                <Slider
                  value={[emotion.intensity]}
                  onValueChange={(value) => handleIntensityChange(emotion.id, value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};