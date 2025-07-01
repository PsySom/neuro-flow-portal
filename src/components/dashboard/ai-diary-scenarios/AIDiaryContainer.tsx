import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { diaryEngine } from './scenarioLogic';
import { DiarySession, Question } from './types';
import SessionSelector from './SessionSelector';
import DiaryChat from './DiaryChat';

interface ChatMessageType {
  id: string;
  type: 'user' | 'ai' | 'question';
  content: string;
  timestamp: Date;
  questionId?: string;
  question?: Question;
}

const AIDiaryContainer = () => {
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

  const startDiarySession = (type: 'morning' | 'midday' | 'evening') => {
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
  };

  const resetSession = () => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setCurrentResponse('');
    setIsCompleted(false);
    setCompletionMessage('');
    setChatMessages([]);
    setInputMessage('');
    setIsTransitioning(false);
  };

  return (
    <Card className="h-[600px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in flex flex-col">
      {!currentSession ? (
        <SessionSelector 
          todaySessions={todaySessions}
          onStartSession={startDiarySession}
        />
      ) : (
        <DiaryChat
          currentSession={currentSession}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          currentResponse={currentResponse}
          setCurrentResponse={setCurrentResponse}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          completionMessage={completionMessage}
          setCompletionMessage={setCompletionMessage}
          todaySessions={todaySessions}
          setTodaySessions={setTodaySessions}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          isTransitioning={isTransitioning}
          setIsTransitioning={setIsTransitioning}
          onResetSession={resetSession}
        />
      )}
    </Card>
  );
};

export default AIDiaryContainer;
