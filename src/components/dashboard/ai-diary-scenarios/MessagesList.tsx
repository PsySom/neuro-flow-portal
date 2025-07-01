import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import QuestionInput from './QuestionInput';
import { Question } from './types';

interface ChatMessageType {
  id: string;
  type: 'user' | 'ai' | 'question';
  content: string;
  timestamp: Date;
  questionId?: string;
  question?: Question;
}

interface MessagesListProps {
  chatMessages: ChatMessageType[];
  currentQuestion: Question | null;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  isCompleted: boolean;
  isTransitioning: boolean;
  onSubmitResponse: () => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  chatMessages,
  currentQuestion,
  currentResponse,
  setCurrentResponse,
  isCompleted,
  isTransitioning,
  onSubmitResponse
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  // Improved scroll effect - trigger on every message change and current question change
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [chatMessages, currentQuestion, isTransitioning, scrollToBottom]);

  // Additional scroll trigger for when new questions appear
  useEffect(() => {
    if (currentQuestion && !isTransitioning) {
      const questionScrollTimeout = setTimeout(() => {
        scrollToBottom();
      }, 200);

      return () => clearTimeout(questionScrollTimeout);
    }
  }, [currentQuestion, isTransitioning, scrollToBottom]);

  return (
    <ScrollArea 
      className="flex-1 pr-4" 
      ref={scrollAreaRef}
    >
      <div className="space-y-4 pb-4">
        {chatMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            index={index}
          />
        ))}

        {!isCompleted && currentQuestion && !isTransitioning && (
          <div className="border-t pt-4 space-y-4 animate-slide-up-fade">
            <div className="ml-11 space-y-4">
              <QuestionInput
                question={currentQuestion}
                currentResponse={currentResponse}
                setCurrentResponse={setCurrentResponse}
                onSubmitResponse={onSubmitResponse}
              />
            </div>
          </div>
        )}

        {isTransitioning && (
          <div className="flex justify-center py-4 animate-fade-in">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </ScrollArea>
  );
};

export default MessagesList;
