
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const FreeChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Привет! Я ваш AI-помощник для психологического благополучия. Расскажите, как дела? О чем хотели бы поговорить?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Спасибо, что поделились! Я понимаю ваши чувства. Это важный шаг - обращать внимание на свое внутреннее состояние. Расскажите больше о том, что вас беспокоит?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea 
          className="flex-1 h-full" 
          ref={scrollAreaRef}
        >
          <div className="space-y-4 p-4">
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
                      backgroundColor: `hsl(var(--psybalans-primary))`
                    } : undefined}
                  >
                    {message.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-opacity duration-200">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3 animate-fade-in">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback 
                    className="text-white font-medium"
                    style={{ backgroundColor: `hsl(var(--psybalans-primary))` }}
                  >
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Отступ внизу для предотвращения прилипания к краю */}
            <div className="h-4"></div>
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Напишите сообщение..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 transition-all duration-200 focus:scale-[1.01]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="text-white transition-all duration-300 hover:scale-110 transform"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeChat;
