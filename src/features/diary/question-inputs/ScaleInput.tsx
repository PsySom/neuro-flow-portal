import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ScaleInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: string[];
}

export const ScaleInput = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 1,
  labels = []
}: ScaleInputProps) => {
  // Функция для получения эмодзи в зависимости от значения настроения
  const getMoodEmoji = (currentValue: number) => {
    // Только для шкалы настроения от -5 до 5
    if (min === -5 && max === 5) {
      if (currentValue <= -4) return '😞';
      if (currentValue === -3) return '😔';
      if (currentValue === -2) return '😕';
      if (currentValue === -1) return '😐';
      if (currentValue === 0) return '🙂';
      if (currentValue === 1) return '😊';
      if (currentValue === 2) return '😃';
      if (currentValue === 3) return '😄';
      if (currentValue === 4) return '😁';
      if (currentValue >= 5) return '🤩';
    }
    // Для шкалы от 0 до 10
    if (min === 0 && max === 10) {
      if (currentValue <= 2) return '😞';
      if (currentValue <= 3) return '😔';
      if (currentValue <= 4) return '😕';
      if (currentValue === 5) return '😐';
      if (currentValue === 6) return '🙂';
      if (currentValue === 7) return '😊';
      if (currentValue === 8) return '😃';
      if (currentValue === 9) return '😄';
      if (currentValue === 10) return '🤩';
    }
    return null;
  };

  const moodEmoji = getMoodEmoji(value);

  return (
    <div className="space-y-4">
      {moodEmoji && (
        <div className="flex justify-center mb-4">
          <div className="text-6xl">
            {moodEmoji}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {min === -5 ? '😞 -5' : min === 0 && max === 10 ? '😞 0' : labels[0] || min}
        </span>
        <span className="text-2xl font-bold text-primary">{value}</span>
        <span className="text-sm text-muted-foreground">
          {max === 5 ? '🤩 +5' : max === 10 && min === 0 ? '🤩 10' : labels[1] || max}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};
