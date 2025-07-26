
import React from 'react';
import { Card } from '@/components/ui/card';
import SessionSelector from './SessionSelector';
import DiaryChat from './DiaryChat';
import { useDiaryState } from './hooks/useDiaryState';

const AIDiaryContainer = () => {
  const {
    currentSession,
    questionState,
    sessionState,
    chatState,
    actions
  } = useDiaryState();

  return (
    <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in flex flex-col overflow-hidden">
      {!currentSession ? (
        <SessionSelector 
          todaySessions={sessionState.todaySessions}
          onStartSession={actions.startDiarySession}
        />
      ) : (
        <DiaryChat
          currentSession={currentSession}
          questionState={questionState}
          sessionState={sessionState}
          chatState={chatState}
          onResetSession={actions.resetSession}
        />
      )}
    </Card>
  );
};

export default AIDiaryContainer;
