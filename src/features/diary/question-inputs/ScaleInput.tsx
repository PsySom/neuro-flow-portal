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
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{labels[0] || min}</span>
        <span className="text-2xl font-bold text-primary">{value}</span>
        <span className="text-sm text-muted-foreground">{labels[1] || max}</span>
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
