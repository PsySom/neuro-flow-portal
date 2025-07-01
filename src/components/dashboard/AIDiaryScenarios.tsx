import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, Clock, Sun, Sunset, Moon, User } from 'lucide-react';
import { diaryEngine } from './ai-diary-scenarios/scenarioLogic';
import { DiarySession, Question } from './ai-diary-scenarios/types';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'question';
  content: string;
  timestamp: Date;
  questionId?: string;
  question?: Question;
}

const AIDiaryScenarios = () => {
  const [currentSession, setCurrentSession] = useState<DiarySession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentResponse, setCurrentResponse] = useState<any>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [todaySessions, setTodaySessions] = useState<DiarySession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Ref for scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'end' 
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [chatMessages, isTransitioning]);

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

      // Добавляем приветственное сообщение и первый вопрос в чат
      const scenario = diaryEngine.getScenario(type);
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        type: 'ai',
        content: scenario.greeting,
        timestamp: new Date()
      };

      setChatMessages([welcomeMessage]);
      
      // Задержка для плавного появления первого вопроса
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

  const handleSendTextMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Добавляем ответ AI на текстовое сообщение с задержкой
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: 'Спасибо за ваши мысли! Это важные заметки. Продолжим с текущим вопросом, когда будете готовы.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuestionResponse = () => {
    if (!currentSession || !currentQuestion || currentResponse === '') return;

    setIsTransitioning(true);

    // Добавляем ответ пользователя в чат
    const responseText = formatResponseForChat(currentResponse, currentQuestion);
    const userResponseMessage: ChatMessage = {
      id: `response_${Date.now()}`,
      type: 'user',
      content: responseText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userResponseMessage]);

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

        // Добавляем финальное сообщение в чат
        setTimeout(() => {
          const completionChatMessage: ChatMessage = {
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
        
        // Добавляем следующий вопрос в чат с задержкой
        setTimeout(() => {
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
      }

      setCurrentResponse('');
    }, 500);
  };

  const formatResponseForChat = (response: any, question: Question): string => {
    if (question.type === 'scale' || question.type === 'emoji-scale') {
      return `Выбрал(а): ${response}`;
    }
    if (question.type === 'multiple-choice') {
      const option = question.options?.find(opt => opt.value === response);
      return option ? `${option.emoji || ''} ${option.label}`.trim() : String(response);
    }
    if (question.type === 'multi-select') {
      if (Array.isArray(response)) {
        const selectedOptions = question.options?.filter(opt => response.includes(opt.value)) || [];
        return selectedOptions.map(opt => `${opt.emoji || ''} ${opt.label}`.trim()).join(', ');
      }
    }
    return String(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendTextMessage();
    }
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4 animate-slide-up-fade">
            <Slider
              value={[currentResponse || question.scaleRange?.min || 0]}
              onValueChange={(value) => setCurrentResponse(value[0])}
              min={question.scaleRange?.min || 0}
              max={question.scaleRange?.max || 10}
              step={question.scaleRange?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.scaleRange?.min || 0}</span>
              <span className="font-medium">Значение: {currentResponse || question.scaleRange?.min || 0}</span>
              <span>{question.scaleRange?.max || 10}</span>
            </div>
          </div>
        );

      case 'emoji-scale':
        return (
          <div className="grid grid-cols-5 gap-3 animate-slide-up-fade">
            {question.options?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => setCurrentResponse(option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-center hover:scale-110 transform ${
                  currentResponse === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="text-3xl mb-2 transition-transform duration-200">{option.emoji}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{option.label}</div>
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3 animate-slide-up-fade">
            {question.options?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => setCurrentResponse(option.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] transform ${
                  currentResponse === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center space-x-3">
                  {option.emoji && <span className="text-xl transition-transform duration-200">{option.emoji}</span>}
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-3 animate-slide-up-fade">
            {question.options?.map((option, index) => (
              <div 
                key={option.value} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <Checkbox
                  checked={(currentResponse || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = currentResponse || [];
                    if (checked) {
                      setCurrentResponse([...current, option.value]);
                    } else {
                      setCurrentResponse(current.filter((v: any) => v !== option.value));
                    }
                  }}
                  className="transition-all duration-200"
                />
                {option.emoji && <span className="text-lg transition-transform duration-200">{option.emoji}</span>}
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2 animate-slide-up-fade">
            <Textarea
              placeholder="Поделитесь своими мыслями..."
              value={currentResponse || ''}
              onChange={(e) => setCurrentResponse(e.target.value)}
              rows={4}
              className="w-full transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        );

      default:
        return (
          <Input
            placeholder="Ваш ответ..."
            value={currentResponse || ''}
            onChange={(e) => setCurrentResponse(e.target.value)}
            className="w-full transition-all duration-200 focus:scale-[1.01]"
          />
        );
    }
  };

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

  if (!currentSession) {
    return (
      <Card className="h-[600px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse-glow"
              style={{
                background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">AI Дневник - Сценарии</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {todaySessions.length > 0 && (
            <div className="space-y-3 animate-slide-in-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Сегодня выполнено:</h3>
              <div className="flex flex-wrap gap-2">
                {todaySessions.map((session, index) => (
                  <Badge 
                    key={session.id} 
                    variant="outline" 
                    className="flex items-center space-x-1 animate-scale-up"
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    {getTimeIcon(session.type)}
                    <span>{getSessionTitle(session.type)}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 animate-slide-in-right">
            <h3 className="font-medium text-gray-900 dark:text-white">Выберите время дня для рефлексии:</h3>
            
            <div className="grid gap-4">
              {[
                { type: 'morning', icon: Sun, color: 'from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20', borderColor: 'border-orange-200 dark:border-orange-800', hoverColor: 'hover:from-orange-200 hover:to-yellow-200 dark:hover:from-orange-800/30 dark:hover:to-yellow-800/30', iconColor: 'text-orange-500', title: 'Утренний дневник', time: '7:00-10:00 • Планирование дня, настройка настроения' },
                { type: 'midday', icon: Sunset, color: 'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20', borderColor: 'border-blue-200 dark:border-blue-800', hoverColor: 'hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30', iconColor: 'text-blue-500', title: 'Дневной дневник', time: '12:00-15:00 • Проверка состояния, корректировка планов' },
                { type: 'evening', icon: Moon, color: 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20', borderColor: 'border-purple-200 dark:border-purple-800', hoverColor: 'hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30', iconColor: 'text-purple-500', title: 'Вечерний дневник', time: '19:00-22:00 • Подведение итогов, подготовка ко сну' }
              ].map((scenario, index) => (
                <Button
                  key={scenario.type}
                  onClick={() => startDiarySession(scenario.type as 'morning' | 'midday' | 'evening')}
                  className={`h-auto p-4 justify-start space-x-3 bg-gradient-to-r ${scenario.color} border ${scenario.borderColor} ${scenario.hoverColor} text-gray-900 dark:text-gray-100 transition-all duration-300 hover:scale-[1.02] transform animate-slide-up-fade`}
                  variant="outline"
                  disabled={todaySessions.some(s => s.type === scenario.type)}
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <scenario.icon className={`w-5 h-5 ${scenario.iconColor}`} />
                  <div className="text-left">
                    <div className="font-medium">{scenario.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{scenario.time}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
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

            {/* Текущий вопрос для ответа */}
            {!isCompleted && currentQuestion && !isTransitioning && (
              <div className="border-t pt-4 space-y-4 animate-slide-up-fade">
                <div className="ml-11 space-y-4">
                  {renderQuestionInput(currentQuestion)}
                  
                  {/* Подсказка и кнопка "Далее" для вопросов с выбором */}
                  {(currentQuestion.type === 'scale' || 
                    currentQuestion.type === 'emoji-scale' || 
                    currentQuestion.type === 'multiple-choice' || 
                    currentQuestion.type === 'multi-select') && (
                    <div className="flex flex-col space-y-2 animate-fade-in">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Сделайте выбор и нажмите "Далее"
                      </p>
                      <Button
                        onClick={handleQuestionResponse}
                        disabled={!currentResponse || (Array.isArray(currentResponse) && currentResponse.length === 0)}
                        className="w-fit text-white transition-all duration-300 hover:scale-105 transform"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
                        }}
                      >
                        Далее
                      </Button>
                    </div>
                  )}
                  
                  {/* Кнопка для текстовых ответов */}
                  {currentQuestion.type === 'text' && (
                    <Button
                      onClick={handleQuestionResponse}
                      disabled={!currentResponse}
                      className="w-fit text-white transition-all duration-300 hover:scale-105 transform animate-fade-in"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
                      }}
                    >
                      Отправить ответ
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Индикатор загрузки во время переходов */}
            {isTransitioning && (
              <div className="flex justify-center py-4 animate-fade-in">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </ScrollArea>
        
        {/* Поле для ввода текстовых сообщений */}
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

        {/* Кнопки управления сессией */}
        {!isCompleted && currentQuestion && (
          <div className="flex-shrink-0 flex justify-between items-center pt-2 border-t animate-fade-in">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentSession(null);
                setCurrentQuestion(null);
                setCurrentResponse('');
                setIsCompleted(false);
                setChatMessages([]);
              }}
              className="transition-all duration-300 hover:scale-105 transform"
            >
              Завершить сессию
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="flex-shrink-0 pt-2 border-t animate-slide-up-fade">
            <Button
              onClick={() => {
                setCurrentSession(null);
                setCurrentQuestion(null);
                setCurrentResponse('');
                setIsCompleted(false);
                setCompletionMessage('');
                setChatMessages([]);
              }}
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
    </Card>
  );
};

export default AIDiaryScenarios;
