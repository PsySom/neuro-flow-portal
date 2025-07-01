
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextInputProps {
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
}

const TextInput: React.FC<TextInputProps> = ({
  currentResponse,
  setCurrentResponse
}) => {
  return (
    <div className="space-y-2 animate-slide-up-fade">
      <Textarea
        placeholder="Поделитесь своими мыслями..."
        value={typeof currentResponse === 'string' ? currentResponse : ''}
        onChange={(e) => setCurrentResponse(e.target.value)}
        rows={4}
        className="w-full transition-all duration-200 focus:scale-[1.01]"
      />
    </div>
  );
};

export default TextInput;
