import { useState, useEffect, useCallback } from 'react';
import { DiarySession, Question } from '../types';
import { ChatMessageType } from '../chatTypes';
import { diaryEngine } from '../scenarioLogic';

export const useDiaryState = () => {
  const [currentSession, setCurrentSession] = useState<DiarySession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentResponse, setCurrentResponse] = useState<string | number | string[] | number[]>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [todaySessions, setTodaySessions] = useState<DiarySession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setTodaySessions(diaryEngine.getTodaySessions());
  }, []);

  const startDiarySession = useCallback((type: 'morning' | 'midday' | 'evening') => {
    setIsTransitioning(true);
    
    const timeoutId = setTimeout(() => {
      const session = diaryEngine.startSession(type);
      const firstQuestion = diaryEngine.getCurrentQuestion();
      
      setCurrentSession(session);
      setCurrentQuestion(firstQuestion);
      setCurrentResponse('');
      setIsCompleted(false);
      setCompletionMessage('');

      const scenario = diaryEngine.getScenario(type);
      const welcomeMessage: ChatMessageType = {
        id: `welcome_${Date.now()}`,
        type: 'ai',
        content: scenario.greeting,
        timestamp: new Date()
      };

      setChatMessages([welcomeMessage]);
      
      const questionTimeoutId = setTimeout(() => {
        if (firstQuestion) {
          const questionMessage: ChatMessageType = {
            id: `question_${Date.now()}`,
            type: 'question',
            content: firstQuestion.text,
            timestamp: new Date(),
            questionId: firstQuestion.id,
            question: firstQuestion
          };
          setChatMessages(prev => [...prev, questionMessage]);
        }
        setIsTransitioning(false);
      }, 800);

      return () => clearTimeout(questionTimeoutId);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const resetSession = useCallback(() => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setCurrentResponse('');
    setIsCompleted(false);
    setCompletionMessage('');
    setChatMessages([]);
    setInputMessage('');
    setIsTransitioning(false);
  }, []);

  return {
    currentSession,
    questionState: {
      currentQuestion,
      setCurrentQuestion,
      currentResponse,
      setCurrentResponse
    },
    sessionState: {
      isCompleted,
      setIsCompleted,
      completionMessage,
      setCompletionMessage,
      todaySessions,
      setTodaySessions
    },
    chatState: {
      chatMessages,
      setChatMessages,
      inputMessage,
      setInputMessage,
      isTransitioning,
      setIsTransitioning
    },
    actions: {
      startDiarySession,
      resetSession
    }
  };
};