
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send } from 'lucide-react';

interface ChatMessage {
  id: number;
  type: 'bot' | 'user';
  content: string;
  time: string;
}

const AIChatComponent = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Привет! Как дела сегодня? Расскажи о своем настроении 😊',
      time: '10:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'Утром чувствовал себя бодро, но к обеду появилась усталость',
      time: '10:32'
    },
    {
      id: 3,
      type: 'bot',
      content: 'Понимаю. Это довольно частое явление. Давай разберем возможные причины. Как твой сон последние дни?',
      time: '10:33'
    }
  ]);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        type: 'user',
        content: message,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
      
      // Симуляция ответа бота
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Спасибо за ответ! Я анализирую ваши паттерны и подготовлю персональные рекомендации.',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-white/70 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span>AI Дневник</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg p-3 rounded-2xl ${
                  msg.type === 'user' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Расскажите о своем состоянии..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatComponent;
