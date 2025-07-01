
import React, { useRef, useEffect, useCallback } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, Sun, Sunset, Moon, Clock, User } from 'lucide-react';
import { diaryEngine } from './scenarioLogic';
import { DiarySession, Question } from './types';
import QuestionInput from './QuestionInput';
import { formatResponseForChat } from './utils';

interface ChatMessage {
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
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
    }
  }, []);

  // Optimized scroll effect - only trigger when messages change or transitioning stops
  useEffect(() => {
    if (chatMessages.length > 0 || !isTransitioning) {
      const timeouts = [
        setTimeout(scrollToBottom, 50),
        setTimeout(scrollToBottom, 150),
        setTimeout(scrollToBottom, 300)
      ];
      
      return () => timeouts.forEach(clearTimeout);
    }
  }, [chatMessages.length, isTransitioning, scrollToBottom]);

  const handleSendTextMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const timeoutId = setTimeout(() => {
      const aiResponse: ChatMessage = {
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
    const userResponseMessage: ChatMessage = {
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
          const completionChatMessage: ChatMessage = {
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
          const nextQuestionMessage: ChatMessage = {
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

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  }, [handleSendTextMessage]);

  const getTimeIcon = (type: string) => {
    switch (type) {
      case 'morning': return <Sun className="w-4 h-4" />;
      case 'midday': return <Sunset className="w-4 h-4" />;
      case 'evening': return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getSessionTitle = (type: string) => {
    switch (type) {
      case 'morning': return 'Утренний дневник';
      case 'midday': return 'Дневной дневник';
      case 'evening': return 'Вечерний дневник';
      default: return 'Дневник';
    }
  };

  return (
    <>
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTimeIcon(currentSession.type)}
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {getSessionTitle(currentSession.type)}
            </span>
          </div>
          <Badge variant="outline" className="animate-pulse">
            {currentSession.currentStep} / {currentSession.totalSteps}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <ScrollArea 
          className="flex-1 pr-4" 
          ref={scrollAreaRef}
        >
          <div className="space-y-4 pb-4">
            {chatMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 animate-slide-up-fade ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback 
                    className={`text-white font-medium transition-all duration-300 hover:scale-110 ${
                      message.type === 'user' 
                        ? 'bg-gray-600 dark:bg-gray-400'
                        : 'text-white'
                    }`}
                    style={message.type !== 'user' ? {
                      backgroundColor: `hsl(var(--psybalans-primary))`
                    } : undefined}
                  >
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-opacity duration-200">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {!isCompleted && currentQuestion && !isTransitioning && (
              <div className="border-t pt-4 space-y-4 animate-slide-up-fade">
                <div className="ml-11 space-y-4">
                  <QuestionInput
                    question={currentQuestion}
                    currentResponse={currentResponse}
                    setCurrentResponse={setCurrentResponse}
                    onSubmitResponse={handleQuestionResponse}
                  />
                </div>
              </div>
            )}

            {isTransitioning && (
              <div className="flex justify-center py-4 animate-fade-in">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 border-t pt-4 animate-slide-up-fade">
          <div className="flex space-x-2">
            <Input
              placeholder="Напишите заметку или комментарий..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 transition-all duration-200 focus:scale-[1.01]"
            />
            <Button
              onClick={handleSendTextMessage}
              disabled={!inputMessage.trim()}
              className="text-white transition-all duration-300 hover:scale-110 transform"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isCompleted && currentQuestion && (
          <div className="flex-shrink-0 flex justify-between items-center pt-2 border-t animate-fade-in">
            <Button
              variant="outline"
              onClick={onResetSession}
              className="transition-all duration-300 hover:scale-105 transform"
            >
              Завершить сессию
            </Button>
          </div>
        )}

        {isCompleted && (
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
        )}
      </CardContent>
    </>
  );
};

export default DiaryChat;
