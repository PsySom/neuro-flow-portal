import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { QuestionOption } from "@/types/scenario.types";

interface ChipsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: QuestionOption[];
  maxSelect?: number;
}

export const ChipsInput = ({ value, onChange, options, maxSelect }: ChipsInputProps) => {
  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter(v => v !== optionId));
    } else {
      if (maxSelect && value.length >= maxSelect) {
        // Заменяем первый выбранный
        onChange([...value.slice(1), optionId]);
      } else {
        onChange([...value, optionId]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {maxSelect && (
        <p className="text-sm text-muted-foreground">
          Выбрано: {value.length} / {maxSelect}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isSelected = value.includes(option.id);
          return (
            <Button
              key={option.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="lg"
              onClick={() => toggleOption(option.id)}
              className="h-auto py-3 px-4"
            >
              {option.emoji && <span className="mr-2 text-xl">{option.emoji}</span>}
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(v => {
            const option = options.find(o => o.id === v);
            return option ? (
              <Badge key={v} variant="secondary" className="text-sm">
                {option.emoji} {option.label}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
