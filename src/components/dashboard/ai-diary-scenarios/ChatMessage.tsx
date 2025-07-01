
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'question';
  content: string;
  timestamp: Date;
  questionId?: string;
}

interface ChatMessageProps {
  message: ChatMessage;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  return (
    <div
      className={`flex items-start space-x-3 animate-slide-up-fade ${
        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}
      style={{
        animationDelay: `${index * 200}ms`
      }}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback 
          className={`text-white font-medium transition-all duration-300 hover:scale-110 ${
            message.type === 'user' 
              ? 'bg-gray-600 dark:bg-gray-400'
              : 'text-white'
          }`}
          style={message.type !== 'user' ? {
            backgroundColor: `hsl(var(--psybalans-primary))`
          } : undefined}
        >
          {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
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
  );
};

export default ChatMessage;
