
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я ваш AI-помощник для отслеживания психологического баланса. Расскажите, как прошёл ваш день?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Спасибо за то, что поделились! Я понимаю, что это может быть сложно. Давайте попробуем разобрать ваши ощущения более детально. Можете оценить своё настроение по шкале от 1 до 10?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
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
    <Card className="h-[600px] flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">AI Дневник</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback 
                    className={`text-white font-medium ${
                      message.sender === 'ai' 
                        ? ''
                        : ''
                    }`}
                    style={{
                      backgroundColor: message.sender === 'ai' 
                        ? `hsl(var(--psybalans-primary))`
                        : 'hsl(var(--muted))'
                    }}
                  >
                    {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : 'Вы'}
                  </AvatarFallback>
                </Avatar>
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                  style={message.sender === 'user' ? {
                    background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
                  } : {}}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' 
                      ? 'text-white/70' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start space-x-3">
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Расскажите о своём дне..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 dark:bg-gray-700 dark:border-gray-600"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="icon"
              className="text-white"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              style={{
                borderColor: `hsl(var(--psybalans-primary))`,
                color: `hsl(var(--psybalans-primary))`
              }}
              onClick={() => setInputValue('Чувствую себя немного подавленно сегодня')}
            >
              😔 Грустно
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              style={{
                borderColor: `hsl(var(--psybalans-primary))`,
                color: `hsl(var(--psybalans-primary))`
              }}
              onClick={() => setInputValue('Сегодня был продуктивный день')}
            >
              😊 Хорошо
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              style={{
                borderColor: `hsl(var(--psybalans-primary))`,
                color: `hsl(var(--psybalans-primary))`
              }}
              onClick={() => setInputValue('Чувствую стресс и тревогу')}
            >
              😰 Стресс
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatComponent;
