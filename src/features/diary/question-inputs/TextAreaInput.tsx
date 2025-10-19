import { Textarea } from "@/components/ui/textarea";

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextAreaInput = ({ value, onChange, placeholder }: TextAreaInputProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Введите ваш ответ..."}
      rows={4}
      className="resize-none"
    />
  );
};
