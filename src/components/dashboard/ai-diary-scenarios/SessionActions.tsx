
import React from 'react';
import { Button } from '@/components/ui/button';
import { Question } from './types';

interface SessionActionsProps {
  isCompleted: boolean;
  currentQuestion: Question | null;
  onResetSession: () => void;
}

const SessionActions: React.FC<SessionActionsProps> = ({
  isCompleted,
  currentQuestion,
  onResetSession
}) => {
  if (isCompleted) {
    return (
      <div className="flex-shrink-0 pt-2 border-t animate-slide-up-fade">
        <Button
          onClick={onResetSession}
          className="w-full text-white transition-all duration-300 hover:scale-105 transform"
          style={{
            background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
          }}
        >
          Начать новую сессию
        </Button>
      </div>
    );
  }

  if (!isCompleted && currentQuestion) {
    return (
      <div className="flex-shrink-0 flex justify-between items-center pt-2 border-t animate-fade-in">
        <Button
          variant="outline"
          onClick={onResetSession}
          className="transition-all duration-300 hover:scale-105 transform"
        >
          Завершить сессию
        </Button>
      </div>
    );
  }

  return null;
};

export default SessionActions;
