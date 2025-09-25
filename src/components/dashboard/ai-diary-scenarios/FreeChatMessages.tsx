import React, { useRef, useEffect, useCallback, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
}

interface FreeChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isAITyping: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const FreeChatMessages: React.FC<FreeChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  isAITyping, 
  onSuggestionClick 
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSuggestionClick = useCallback((suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  }, [onSuggestionClick]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            viewport.scrollTo({
              top: viewport.scrollHeight,
              behavior: 'smooth'
            });
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, isAITyping, scrollToBottom]);

  const copyToClipboard = useCallback(async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      toast({
        title: "Скопировано",
        description: "Сообщение скопировано в буфер обмена",
      });
      
      // Скрываем индикатор копирования через 2 секунды
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать текст",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea 
        className="h-full scroll-smooth"
        ref={scrollAreaRef}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="space-y-4 p-4 pb-8 min-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`group flex items-start space-x-3 animate-fade-in ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback 
                  className={`text-white font-medium ${
                    message.type === 'ai' 
                      ? 'text-white' 
                      : 'bg-gray-600 dark:bg-gray-400'
                  }`}
                  style={message.type === 'ai' ? {
                    backgroundColor: `hsl(var(--primary))`
                  } : undefined}
                >
                  {message.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`relative rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                    {message.isTyping && (
                      <span className="inline-block ml-1 w-2 h-4 bg-current animate-pulse">|</span>
                    )}
                  </p>
                  
                  {/* Кнопка копирования */}
                  {message.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`absolute top-2 ${
                        message.type === 'user' ? 'left-2' : 'right-2'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0`}
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Suggestions для AI сообщений */}
                {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && !message.isTyping && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">Быстрые ответы:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-1 transition-opacity duration-200">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Индикатор "AI печатает..." */}
          {isAITyping && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback 
                  className="text-white font-medium"
                  style={{ backgroundColor: `hsl(var(--primary))` }}
                >
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">AI печатает</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Индикатор загрузки (старый, для совместимости) */}
          {isLoading && !isAITyping && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback 
                  className="text-white font-medium"
                  style={{ backgroundColor: `hsl(var(--primary))` }}
                >
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FreeChatMessages;