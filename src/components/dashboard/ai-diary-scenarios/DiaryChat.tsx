
import React from 'react';
import { DiarySession, Question } from './types';
import { ChatMessageType } from './chatTypes';
import { useDiaryChat } from './useDiaryChat';
import DiaryHeader from './DiaryHeader';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';
import SessionActions from './SessionActions';

// Упрощенный интерфейс с группировкой связанных состояний
interface DiaryChatProps {
  currentSession: DiarySession;
  questionState: {
    currentQuestion: Question | null;
    setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
    currentResponse: string | number | string[] | number[];
    setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  };
  sessionState: {
    isCompleted: boolean;
    setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    completionMessage: string;
    setCompletionMessage: React.Dispatch<React.SetStateAction<string>>;
    todaySessions: DiarySession[];
    setTodaySessions: React.Dispatch<React.SetStateAction<DiarySession[]>>;
  };
  chatState: {
    chatMessages: ChatMessageType[];
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    isTransitioning: boolean;
    setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
  };
  onResetSession: () => void;
}

const DiaryChat: React.FC<DiaryChatProps> = ({
  currentSession,
  questionState,
  sessionState,
  chatState,
  onResetSession
}) => {
  const { handleSendTextMessage, handleQuestionResponse } = useDiaryChat({
    currentSession,
    questionState,
    sessionState,
    chatState
  });

  const handleSendMessage = () => {
    handleSendTextMessage(chatState.inputMessage);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <DiaryHeader currentSession={currentSession} />
      </div>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessagesList
          chatMessages={chatState.chatMessages}
          currentQuestion={questionState.currentQuestion}
          currentResponse={questionState.currentResponse}
          setCurrentResponse={questionState.setCurrentResponse}
          isCompleted={sessionState.isCompleted}
          isTransitioning={chatState.isTransitioning}
          onSubmitResponse={handleQuestionResponse}
        />
      </div>
      
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 space-y-3">
          <ChatInput
            inputMessage={chatState.inputMessage}
            setInputMessage={chatState.setInputMessage}
            onSendMessage={handleSendMessage}
          />
          
          <SessionActions
            isCompleted={sessionState.isCompleted}
            currentQuestion={questionState.currentQuestion}
            onResetSession={onResetSession}
          />
        </div>
      </div>
    </div>
  );
};

export default DiaryChat;
