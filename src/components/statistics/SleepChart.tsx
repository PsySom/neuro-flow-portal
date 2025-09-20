import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useSleepDiary } from '@/hooks/useSleepDiary';
import { sleepQualityLabels } from '@/components/diaries/sleep/types';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface SleepChartData {
  time: string;
  fullDate: string;
  sleepQuality: number;
  sleepDuration: number;
  morningFeeling: number;
  nightAwakenings: number;
  sleepQualityEmoji: string;
  hasRest: boolean;
  restType?: string;
  sleepComment?: string;
  restComment?: string;
  disruptors?: string[];
}

type TimeRange = 'day' | 'week' | 'month';

const SleepChart = () => {
  const { isAuthenticated } = useSupabaseAuth();
  const { entries, loading, error } = useSleepDiary();
  const [chartData, setChartData] = useState<SleepChartData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedPoint, setSelectedPoint] = useState<SleepChartData | null>(null);

  const getTimeFormat = (range: TimeRange, date: Date): string => {
    switch (range) {
      case 'day':
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
      case 'month':
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      default:
        return date.toLocaleDateString('ru-RU');
    }
  };

  const getSleepQualityEmoji = (quality: number): string => {
    const key = quality.toString() as keyof typeof sleepQualityLabels;
    const label = sleepQualityLabels[key];
    return label ? label.split(' ')[0] : '😐';
  };

  useEffect(() => {
    if (entries.length > 0) {
      const data = entries.map(entry => {
        const date = new Date(entry.created_at || '');
        return {
          time: getTimeFormat(timeRange, date),
          fullDate: date.toLocaleDateString('ru-RU', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          sleepQuality: entry.sleep_quality,
          sleepDuration: entry.sleep_duration,
          morningFeeling: entry.morning_feeling,
          nightAwakenings: entry.night_awakenings,
          sleepQualityEmoji: getSleepQualityEmoji(entry.sleep_quality),
          hasRest: entry.has_day_rest,
          restType: entry.day_rest_type,
          sleepComment: entry.sleep_comment,
          restComment: entry.rest_comment,
          disruptors: entry.sleep_disruptors
        };
      }).reverse(); // Показываем от старых к новым
      
      setChartData(data);
    }
  }, [entries, timeRange]);

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill="hsl(var(--primary))" 
          stroke="white" 
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedPoint(payload)}
        />
        <text 
          x={cx} 
          y={cy - 15} 
          textAnchor="middle" 
          fontSize={16}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedPoint(payload)}
        >
          {payload.sleepQualityEmoji}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-lg mr-2">{data.sleepQualityEmoji}</span>
            Качество сна: {data.sleepQuality}
          </p>
          <p className="text-sm">Продолжительность: {data.sleepDuration} ч</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Загрузка данных сна...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Ошибка загрузки данных: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Загрузка данных сна...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Ошибка загрузки данных: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill="hsl(var(--primary))" 
          stroke="white" 
          strokeWidth={2}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedPoint(payload)}
        />
        <text 
          x={cx} 
          y={cy - 15} 
          textAnchor="middle" 
          fontSize={16}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedPoint(payload)}
        >
          {payload.sleepQualityEmoji}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="text-lg mr-2">{data.sleepQualityEmoji}</span>
            Качество сна: {data.sleepQuality}
          </p>
          <p className="text-sm">Продолжительность: {data.sleepDuration} ч</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Показываем предупреждение если пользователь не авторизован */}
      {!isAuthenticated && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
          <CardContent className="pt-6">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              📊 Для просмотра статистики необходимо 
              <strong> войти в аккаунт</strong>. Здесь будут отображаться ваши реальные записи дневника сна и отдыха.
            </p>
          </CardContent>
        </Card>
      )}
        {/* Показываем предупреждение если пользователь не авторизован */}
        {!isAuthenticated && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
            <CardContent className="pt-6">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                📊 Для просмотра статистики необходимо 
                <strong> войти в аккаунт</strong>. Здесь будут отображаться ваши реальные записи дневника сна и отдыха.
              </p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">📊 График пуст</p>
              <p className="text-sm">Здесь будут отображаться ваши записи из дневника сна и отдыха. Создайте первую запись, чтобы увидеть данные на графике.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>График сна и отдыха</span>
            <div className="flex space-x-2">
              <Button
                variant={timeRange === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('day')}
              >
                День
              </Button>
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                Неделя
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                Месяц
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Загрузка данных сна...</p>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    angle={timeRange === 'week' ? -45 : 0}
                    textAnchor={timeRange === 'week' ? 'end' : 'middle'}
                    height={timeRange === 'week' ? 60 : 30}
                  />
                  <YAxis 
                    domain={[-5, 5]} 
                    ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Качество сна', angle: -90, position: 'insideLeft' }}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="sleepQuality" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={<CustomDot />}
                    connectNulls={false}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Продолжительность сна */}
      <Card>
        <CardHeader>
          <CardTitle>Продолжительность сна</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 12]} label={{ value: 'Часы', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value} ч`, 'Продолжительность']}
              />
              <Line 
                type="monotone" 
                dataKey="sleepDuration" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Панель подробностей */}
      <Card>
        <CardHeader>
          <CardTitle>Подробности записи сна</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPoint ? (
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Время записи: {selectedPoint.fullDate}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      <span className="text-2xl mr-2">{selectedPoint.sleepQualityEmoji}</span>
                      Качество сна: {selectedPoint.sleepQuality}
                    </h4>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Продолжительность сна</h4>
                    <p className="text-muted-foreground">{selectedPoint.sleepDuration} часов</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Утреннее самочувствие</h4>
                    <p className="text-muted-foreground">{selectedPoint.morningFeeling}/10</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Ночные пробуждения</h4>
                    <p className="text-muted-foreground">{selectedPoint.nightAwakenings} раз</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Дневной отдых</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.hasRest ? 
                        `Да ${selectedPoint.restType ? `(${selectedPoint.restType})` : ''}` : 
                        'Нет'
                      }
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Нарушители сна</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.disruptors && selectedPoint.disruptors.length > 0
                        ? selectedPoint.disruptors.join(', ')
                        : 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Комментарий о сне</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.sleepComment || 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Комментарий об отдыхе</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.restComment || 'Не указано'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedPoint(null)}
                >
                  Очистить выбор
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-2">Нажмите на точку графика, чтобы увидеть подробности</p>
              <p className="text-sm">Подробности доступны для всех режимов просмотра</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepChart;