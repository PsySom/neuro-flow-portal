
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, Clock, Sun, Sunset, Moon } from 'lucide-react';
import { diaryEngine } from './ai-diary-scenarios/scenarioLogic';
import { DiarySession, Question } from './ai-diary-scenarios/types';

const AIDiaryScenarios = () => {
  const [currentSession, setCurrentSession] = useState<DiarySession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentResponse, setCurrentResponse] = useState<any>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [todaySessions, setTodaySessions] = useState<DiarySession[]>([]);

  useEffect(() => {
    // Загружаем сегодняшние сессии
    setTodaySessions(diaryEngine.getTodaySessions());
  }, []);

  const startDiarySession = (type: 'morning' | 'midday' | 'evening') => {
    const session = diaryEngine.startSession(type);
    setCurrentSession(session);
    setCurrentQuestion(diaryEngine.getCurrentQuestion());
    setCurrentResponse('');
    setIsCompleted(false);
    setCompletionMessage('');
  };

  const handleResponse = () => {
    if (!currentSession || !currentQuestion || currentResponse === '') return;

    const { nextQuestion, isCompleted: sessionCompleted } = diaryEngine.processResponse(
      currentQuestion.id,
      currentResponse
    );

    if (sessionCompleted) {
      setIsCompleted(true);
      setCompletionMessage(diaryEngine.generatePersonalizedMessage(currentSession));
      diaryEngine.saveSession(currentSession);
      setTodaySessions(diaryEngine.getTodaySessions());
    } else {
      setCurrentQuestion(nextQuestion);
    }

    setCurrentResponse('');
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <Slider
              value={[currentResponse || currentQuestion.scaleRange?.min || 0]}
              onValueChange={(value) => setCurrentResponse(value[0])}
              min={currentQuestion.scaleRange?.min || 0}
              max={currentQuestion.scaleRange?.max || 10}
              step={currentQuestion.scaleRange?.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{currentQuestion.scaleRange?.min || 0}</span>
              <span className="font-medium">Текущее значение: {currentResponse || currentQuestion.scaleRange?.min || 0}</span>
              <span>{currentQuestion.scaleRange?.max || 10}</span>
            </div>
          </div>
        );

      case 'emoji-scale':
        return (
          <div className="grid grid-cols-5 gap-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => setCurrentResponse(option.value)}
                className={`p-4 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                  currentResponse === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{option.label}</div>
              </button>
            ))}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => setCurrentResponse(option.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left hover:scale-[1.02] ${
                  currentResponse === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {option.emoji && <span className="text-xl">{option.emoji}</span>}
                  <span className="font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
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
                />
                {option.emoji && <span className="text-lg">{option.emoji}</span>}
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <Textarea
              placeholder="Поделитесь своими мыслями..."
              value={currentResponse || ''}
              onChange={(e) => setCurrentResponse(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>
        );

      default:
        return (
          <Input
            placeholder="Ваш ответ..."
            value={currentResponse || ''}
            onChange={(e) => setCurrentResponse(e.target.value)}
            className="w-full"
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
      <Card className="h-[600px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
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
          {/* Сегодняшние сессии */}
          {todaySessions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Сегодня выполнено:</h3>
              <div className="flex flex-wrap gap-2">
                {todaySessions.map((session) => (
                  <Badge key={session.id} variant="outline" className="flex items-center space-x-1">
                    {getTimeIcon(session.type)}
                    <span>{getSessionTitle(session.type)}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Выбор сценария */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Выберите время дня для рефлексии:</h3>
            
            <div className="grid gap-4">
              <Button
                onClick={() => startDiarySession('morning')}
                className="h-auto p-4 justify-start space-x-3 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 hover:from-orange-200 hover:to-yellow-200 dark:hover:from-orange-800/30 dark:hover:to-yellow-800/30 text-gray-900 dark:text-gray-100"
                variant="outline"
                disabled={todaySessions.some(s => s.type === 'morning')}
              >
                <Sun className="w-5 h-5 text-orange-500" />
                <div className="text-left">
                  <div className="font-medium">Утренний дневник</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">7:00-10:00 • Планирование дня, настройка настроения</div>
                </div>
              </Button>

              <Button
                onClick={() => startDiarySession('midday')}
                className="h-auto p-4 justify-start space-x-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 text-gray-900 dark:text-gray-100"
                variant="outline"
                disabled={todaySessions.some(s => s.type === 'midday')}
              >
                <Sunset className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Дневной дневник</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">12:00-15:00 • Проверка состояния, корректировка планов</div>
                </div>
              </Button>

              <Button
                onClick={() => startDiarySession('evening')}
                className="h-auto p-4 justify-start space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 text-gray-900 dark:text-gray-100"
                variant="outline"
                disabled={todaySessions.some(s => s.type === 'evening')}
              >
                <Moon className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Вечерний дневник</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">19:00-22:00 • Подведение итогов, подготовка ко сну</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTimeIcon(currentSession.type)}
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {getSessionTitle(currentSession.type)}
            </span>
          </div>
          <Badge variant="outline">
            {currentSession.currentStep} / {currentSession.totalSteps}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        <ScrollArea className="flex-1">
          {!isCompleted ? (
            currentQuestion && (
              <div className="space-y-6">
                {/* AI Вопрос */}
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback 
                      className="text-white font-medium"
                      style={{ backgroundColor: `hsl(var(--psybalans-primary))` }}
                    >
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                      {currentQuestion.text}
                    </p>
                  </div>
                </div>

                {/* Поле ответа */}
                <div className="ml-11 space-y-4">
                  {renderQuestionInput()}
                </div>
              </div>
            )
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Сессия завершена! 🌟
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">
                    {completionMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        
        {!isCompleted && currentQuestion && (
          <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentSession(null);
                setCurrentQuestion(null);
                setCurrentResponse('');
                setIsCompleted(false);
              }}
            >
              Прервать сессию
            </Button>
            
            <Button
              onClick={handleResponse}
              disabled={!currentResponse || (Array.isArray(currentResponse) && currentResponse.length === 0)}
              className="text-white"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Ответить
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="flex-shrink-0 pt-4 border-t">
            <Button
              onClick={() => {
                setCurrentSession(null);
                setCurrentQuestion(null);
                setCurrentResponse('');
                setIsCompleted(false);
                setCompletionMessage('');
              }}
              className="w-full text-white"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`
              }}
            >
              Завершить сессию
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDiaryScenarios;
