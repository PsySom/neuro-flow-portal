import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotivationalMessageProps {
  step: number;
  totalSteps: number;
  className?: string;
}

const getMotivationalMessage = (step: number, totalSteps: number): { emoji: string; message: string } => {
  const progress = (step / totalSteps) * 100;
  
  if (step === 1) {
    return { emoji: '👋', message: 'Добро пожаловать! Давайте начнём ваше путешествие' };
  }
  
  if (step === 2) {
    return { emoji: '✨', message: 'Отлично! Теперь расскажите немного о себе' };
  }
  
  if (progress <= 40) {
    return { emoji: '🚀', message: 'Отличное начало! Продолжайте в том же духе' };
  }
  
  if (progress <= 60) {
    return { emoji: '🎯', message: 'Вы на полпути! Осталось совсем немного' };
  }
  
  if (progress <= 80) {
    return { emoji: '⭐', message: 'Почти готово! Ещё немного и всё будет настроено' };
  }
  
  if (step === totalSteps - 1) {
    return { emoji: '🎉', message: 'Последний шаг! Вы отлично справляетесь' };
  }
  
  return { emoji: '💫', message: 'Великолепно! Продолжайте' };
};

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ 
  step, 
  totalSteps, 
  className 
}) => {
  const { emoji, message } = getMotivationalMessage(step, totalSteps);
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 animate-fade-in",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="text-2xl emoji-scale" aria-hidden="true">{emoji}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {message}
        </p>
      </div>
      <Sparkles className="w-4 h-4 text-primary animate-pulse" aria-hidden="true" />
    </div>
  );
};

export default MotivationalMessage;
