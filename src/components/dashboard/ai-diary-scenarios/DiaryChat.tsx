
import React from 'react';
import { DiarySession, Question } from './types';
import { ChatMessageType } from './chatTypes';
import { useDiaryChat } from './useDiaryChat';
import DiaryHeader from './DiaryHeader';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';
import SessionActions from './SessionActions';

interface DiaryChatProps {
  currentSession: DiarySession;
  currentQuestion: Question | null;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  isCompleted: boolean;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  completionMessage: string;
  setCompletionMessage: React.Dispatch<React.SetStateAction<string>>;
  todaySessions: DiarySession[];
  setTodaySessions: React.Dispatch<React.SetStateAction<DiarySession[]>>;
  chatMessages: ChatMessageType[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isTransitioning: boolean;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  onResetSession: () => void;
}

const DiaryChat: React.FC<DiaryChatProps> = ({
  currentSession,
  currentQuestion,
  setCurrentQuestion,
  currentResponse,
  setCurrentResponse,
  isCompleted,
  setIsCompleted,
  completionMessage,
  setCompletionMessage,
  todaySessions,
  setTodaySessions,
  chatMessages,
  setChatMessages,
  inputMessage,
  setInputMessage,
  isTransitioning,
  setIsTransitioning,
  onResetSession
}) => {
  const { handleSendTextMessage, handleQuestionResponse } = useDiaryChat({
    currentSession,
    currentQuestion,
    setCurrentQuestion,
    currentResponse,
    setCurrentResponse,
    setIsCompleted,
    setCompletionMessage,
    setTodaySessions,
    setChatMessages,
    setInputMessage,
    setIsTransitioning
  });

  const handleSendMessage = () => {
    handleSendTextMessage(inputMessage);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <DiaryHeader currentSession={currentSession} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <MessagesList
          chatMessages={chatMessages}
          currentQuestion={currentQuestion}
          currentResponse={currentResponse}
          setCurrentResponse={setCurrentResponse}
          isCompleted={isCompleted}
          isTransitioning={isTransitioning}
          onSubmitResponse={handleQuestionResponse}
        />
      </div>
        
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 space-y-3">
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
          />
          
          <SessionActions
            isCompleted={isCompleted}
            currentQuestion={currentQuestion}
            onResetSession={onResetSession}
          />
        </div>
      </div>
    </div>
  );
};

export default DiaryChat;
