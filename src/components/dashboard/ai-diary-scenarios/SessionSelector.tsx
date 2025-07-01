
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sun, Sunset, Moon, Clock } from 'lucide-react';
import { DiarySession } from './types';

interface SessionSelectorProps {
  todaySessions: DiarySession[];
  onStartSession: (type: 'morning' | 'midday' | 'evening') => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({
  todaySessions,
  onStartSession
}) => {
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
                onClick={() => onStartSession(scenario.type as 'morning' | 'midday' | 'evening')}
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
    </>
  );
};

export default SessionSelector;
