
import { useCallback, useEffect } from 'react';
import { diaryEngine } from './scenarioLogic';
import { DiarySession, Question } from './types';
import { formatResponseForChat } from './utils';
import { ChatMessageType } from './chatTypes';

interface UseDiaryChatProps {
  currentSession: DiarySession;
  currentQuestion: Question | null;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  currentResponse: string | number | string[] | number[];
  setCurrentResponse: React.Dispatch<React.SetStateAction<string | number | string[] | number[]>>;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletionMessage: React.Dispatch<React.SetStateAction<string>>;
  setTodaySessions: React.Dispatch<React.SetStateAction<DiarySession[]>>;
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDiaryChat = ({
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
}: UseDiaryChatProps) => {
  // Initialize response when question changes
  useEffect(() => {
    if (currentQuestion) {
      // Reset response for new question
      if (currentQuestion.type === 'scale') {
        const initialValue = currentQuestion.scaleRange?.min || 0;
        setCurrentResponse(initialValue);
      } else if (currentQuestion.type === 'multi-select') {
        setCurrentResponse([]);
      } else {
        setCurrentResponse('');
      }
    }
  }, [currentQuestion?.id, setCurrentResponse]);

  const handleSendTextMessage = useCallback((inputMessage: string) => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiResponse: ChatMessageType = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: 'Спасибо за ваши мысли! Это важные заметки. Продолжим с текущим вопросом, когда будете готовы.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }, [setChatMessages, setInputMessage]);

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

    setTimeout(() => {
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

        setTimeout(() => {
          const completionChatMessage: ChatMessageType = {
            id: `completion_${Date.now()}`,
            type: 'ai',
            content: finalMessage,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, completionChatMessage]);
          setIsTransitioning(false);
        }, 800);
      } else if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        
        setTimeout(() => {
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
      }
    }, 500);
  }, [currentSession, currentQuestion, currentResponse, setChatMessages, setCurrentQuestion, setIsCompleted, setCompletionMessage, setTodaySessions, setIsTransitioning]);

  return {
    handleSendTextMessage,
    handleQuestionResponse
  };
};
