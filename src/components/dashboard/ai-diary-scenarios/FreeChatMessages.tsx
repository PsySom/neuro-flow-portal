import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FreeChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const FreeChatMessages: React.FC<FreeChatMessagesProps> = ({ messages, isLoading }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  }, [messages, isLoading, scrollToBottom]);

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
              className={`flex items-start space-x-3 animate-slide-up-fade ${
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
                  className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 transition-opacity duration-200">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
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