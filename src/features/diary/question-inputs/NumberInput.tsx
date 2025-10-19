import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

export const NumberInput = ({ value, onChange, min = 0, max = 100, unit }: NumberInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="flex-1"
      />
      {unit && (
        <Label className="text-muted-foreground min-w-[40px]">{unit}</Label>
      )}
    </div>
  );
};
