import React, { useCallback, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface FreeChatInputProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const FreeChatInput = forwardRef<HTMLInputElement, FreeChatInputProps>(({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  disabled = false
}, ref) => {
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Обычный Enter или Ctrl+Enter для отправки
      if (!e.shiftKey || e.ctrlKey) {
        e.preventDefault();
        if (inputMessage.trim() && !isLoading && !disabled) {
          onSendMessage(inputMessage);
        }
      }
    }
  }, [onSendMessage, inputMessage, isLoading, disabled]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, [setInputMessage]);

  const handleSendClick = useCallback(() => {
    if (inputMessage.trim() && !isLoading && !disabled) {
      onSendMessage(inputMessage);
    }
  }, [inputMessage, onSendMessage, isLoading, disabled]);

  const isDisabled = !inputMessage.trim() || isLoading || disabled;

  return (
    <div className="border-t border-border bg-background">
      <div className="p-4">
        <div className="flex space-x-2">
          <Input
            ref={ref}
            placeholder="Напишите сообщение... (Enter или Ctrl+Enter для отправки)"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 transition-all duration-200 focus:scale-[1.01]"
            disabled={isLoading || disabled}
            autoComplete="off"
          />
          <Button
            onClick={handleSendClick}
            disabled={isDisabled}
            className="text-primary-foreground transition-all duration-300 hover:scale-110 transform shrink-0"
            size="default"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Совет: используйте Enter для отправки, Shift+Enter для новой строки
        </div>
      </div>
    </div>
  );
});

FreeChatInput.displayName = 'FreeChatInput';

export default FreeChatInput;