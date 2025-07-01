
import React, { useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { diaryEngine } from './scenarioLogic';
import { DiarySession, Question } from './types';
import { formatResponseForChat } from './utils';
import DiaryHeader from './DiaryHeader';
import MessagesList from './MessagesList';
import ChatInput from './ChatInput';
import SessionActions from './SessionActions';

interface ChatMessageType {
  id: string;
  type: 'user' | 'ai' | 'question';
  content: string;
  timestamp: Date;
  questionId?: string;
  question?: Question;
}

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
  const handleSendTextMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const timeoutId = setTimeout(() => {
      const aiResponse: ChatMessageType = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: 'Спасибо за ваши мысли! Это важные заметки. Продолжим с текущим вопросом, когда будете готовы.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [inputMessage, setChatMessages, setInputMessage]);

  const handleQuestionResponse = useCallback(() => {
    if (!currentSession || !currentQuestion || currentResponse === '') return;

    setIsTransitioning(true);

    const responseText = formatResponseForChat(currentResponse, currentQuestion);
    const userResponseMessage: ChatMessageType = {
      id: `response_${Date.now()}`,
      type: 'user',
      content: responseText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userResponseMessage]);
    setCurrentQuestion(null);

    const timeoutId = setTimeout(() => {
      const { nextQuestion, isCompleted: sessionCompleted } = diaryEngine.processResponse(
        currentQuestion.id,
        currentResponse
      );

      if (sessionCompleted) {
        setIsCompleted(true);
        const finalMessage = diaryEngine.generatePersonalizedMessage(currentSession);
        setCompletionMessage(finalMessage);
        diaryEngine.saveSession(currentSession);
        setTodaySessions(diaryEngine.getTodaySessions());

        const completionTimeoutId = setTimeout(() => {
          const completionChatMessage: ChatMessageType = {
            id: `completion_${Date.now()}`,
            type: 'ai',
            content: finalMessage,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, completionChatMessage]);
          setIsTransitioning(false);
        }, 800);

        return () => clearTimeout(completionTimeoutId);
      } else if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        
        const questionTimeoutId = setTimeout(() => {
          const nextQuestionMessage: ChatMessageType = {
            id: `question_${Date.now()}`,
            type: 'question',
            content: nextQuestion.text,
            timestamp: new Date(),
            questionId: nextQuestion.id,
            question: nextQuestion
          };
          setChatMessages(prev => [...prev, nextQuestionMessage]);
          setIsTransitioning(false);
        }, 800);

        return () => clearTimeout(questionTimeoutId);
      }

      setCurrentResponse('');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentSession, currentQuestion, currentResponse, setChatMessages, setCurrentQuestion, setIsCompleted, setCompletionMessage, setTodaySessions, setIsTransitioning, setCurrentResponse]);

  return (
    <>
      <DiaryHeader currentSession={currentSession} />
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <MessagesList
          chatMessages={chatMessages}
          currentQuestion={currentQuestion}
          currentResponse={currentResponse}
          setCurrentResponse={setCurrentResponse}
          isCompleted={isCompleted}
          isTransitioning={isTransitioning}
          onSubmitResponse={handleQuestionResponse}
        />
        
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendTextMessage}
        />

        <SessionActions
          isCompleted={isCompleted}
          currentQuestion={currentQuestion}
          onResetSession={onResetSession}
        />
      </CardContent>
    </>
  );
};

export default DiaryChat;
