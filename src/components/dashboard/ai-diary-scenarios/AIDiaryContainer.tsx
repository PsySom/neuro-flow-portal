
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { diaryEngine } from './scenarioLogic';
import { DiarySession, Question } from './types';
import SessionSelector from './SessionSelector';
import DiaryChat from './DiaryChat';

interface ChatMessage {
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
  const [currentResponse, setCurrentResponse] = useState<any>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [todaySessions, setTodaySessions] = useState<DiarySession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setTodaySessions(diaryEngine.getTodaySessions());
  }, []);

  const startDiarySession = (type: 'morning' | 'midday' | 'evening') => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      const session = diaryEngine.startSession(type);
      const firstQuestion = diaryEngine.getCurrentQuestion();
      
      setCurrentSession(session);
      setCurrentQuestion(firstQuestion);
      setCurrentResponse('');
      setIsCompleted(false);
      setCompletionMessage('');

      const scenario = diaryEngine.getScenario(type);
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        type: 'ai',
        content: scenario.greeting,
        timestamp: new Date()
      };

      setChatMessages([welcomeMessage]);
      
      setTimeout(() => {
        const questionMessage: ChatMessage = {
          id: `question_${Date.now()}`,
          type: 'question',
          content: firstQuestion?.text || '',
          timestamp: new Date(),
          questionId: firstQuestion?.id,
          question: firstQuestion
        };
        setChatMessages(prev => [...prev, questionMessage]);
        setIsTransitioning(false);
      }, 800);
    }, 300);
  };

  const resetSession = () => {
    setCurrentSession(null);
    setCurrentQuestion(null);
    setCurrentResponse('');
    setIsCompleted(false);
    setCompletionMessage('');
    setChatMessages([]);
  };

  return (
    <Card className="h-[600px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
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
