
import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import QuestionInput from './QuestionInput';
import { Question } from './types';
import { ChatMessageType } from './chatTypes';

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

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        // Улучшенная логика скролла с проверкой готовности DOM
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
  }, [chatMessages, currentQuestion, isTransitioning, scrollToBottom]);

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea 
        className="h-full scroll-smooth"
        ref={scrollAreaRef}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="space-y-4 p-4 pb-8 min-h-full flex flex-col justify-end">
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessagesList;
