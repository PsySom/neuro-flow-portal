
import React, { useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = memo(({
  inputMessage,
  setInputMessage,
  onSendMessage
}) => {
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        onSendMessage();
      }
    }
  }, [onSendMessage, inputMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, [setInputMessage]);

  const handleSendClick = useCallback(() => {
    if (inputMessage.trim()) {
      onSendMessage();
    }
  }, [inputMessage, onSendMessage]);

  const isDisabled = !inputMessage.trim();

  return (
    <div className="animate-slide-up-fade">
      <div className="flex space-x-2">
        <Input
          placeholder="Напишите заметку или комментарий..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 transition-all duration-200 focus:scale-[1.01] bg-white dark:bg-gray-700"
          autoComplete="off"
        />
        <Button
          onClick={handleSendClick}
          disabled={isDisabled}
          className="text-white transition-all duration-300 hover:scale-110 transform shrink-0"
          style={{
            background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
          }}
          aria-label="Отправить сообщение"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

export default ChatInput;
