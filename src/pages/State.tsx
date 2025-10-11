
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import UserMenu from '@/components/dashboard/UserMenu';
import { StateChart } from '@/components/state/StateChart';
import { TodayMetrics } from '@/components/state/TodayMetrics';
import { useStateMetrics } from '@/hooks/useStateMetrics';
import { Skeleton } from '@/components/ui/skeleton';

const State = () => {
  const { metrics, todayMetrics, loading, refreshMetrics } = useStateMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PsyBalans
                </span>
              </Link>
              
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  К дашборду
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Текущее состояние
            </h1>
            <p className="text-muted-foreground">
              Отслеживание настроения, энергии и уровня стресса
            </p>
          </div>
          <Button 
            onClick={refreshMetrics} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        {/* Today's Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Показатели сегодня
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <TodayMetrics metrics={todayMetrics} />
          )}
        </div>

        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Динамика за неделю</CardTitle>
            <CardDescription>
              График изменения показателей за последние 7 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : metrics.length > 0 ? (
              <StateChart metrics={metrics} />
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Нет данных для отображения
                </h3>
                <p className="text-muted-foreground mb-4">
                  Начните заполнять дневник настроения, чтобы видеть графики
                </p>
                <Link to="/diaries">
                  <Button>Перейти к дневникам</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default State;
