
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getMoodEmoji } from '../diaries/moodDiaryUtils';
import { ChartDataPoint, TimeRange } from './chart-utils/chartDataConverters';
import { chartDataService } from './chart-utils/chartDataService';
import { CustomTooltip, CustomDot, getLineWidth } from './chart-utils/chartComponents';

const MoodEmotionsChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка данных с помощью сервиса
  const fetchMoodData = async (range: TimeRange) => {
    setIsLoading(true);
    try {
      const data = await chartDataService.fetchMoodData(range);
      setChartData(data);
    } catch (error) {
      console.error('❌ Ошибка при загрузке данных настроения:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при изменении диапазона времени
  useEffect(() => {
    fetchMoodData(timeRange);
  }, [timeRange]);

  // Автоматическое обновление данных
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMoodData(timeRange);
    }, 30000); // Обновляем каждые 30 секунд

    // Обновляем при фокусе окна
    const handleFocus = () => {
      fetchMoodData(timeRange);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [timeRange]);

  const currentData = chartData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>График настроения и эмоций</span>
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
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Загрузка данных настроения...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-muted-foreground">Нет данных для отображения</p>
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
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
                  />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3b82f6" 
                    strokeWidth={getLineWidth(timeRange)}
                    dot={<CustomDot 
                      timeRange={timeRange} 
                      onPointClick={setSelectedPoint}
                      cx={0} cy={0} payload={{} as ChartDataPoint} index={0}
                    />}
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

      {/* Панель подробностей */}
      <Card>
        <CardHeader>
          <CardTitle>Подробности точки настроения</CardTitle>
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
                      <span className="text-2xl mr-2">{getMoodEmoji(selectedPoint.mood)}</span>
                      Настроение: {selectedPoint.mood}
                    </h4>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Эмоции</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.emotions && selectedPoint.emotions.length > 0 
                        ? selectedPoint.emotions.join(', ') 
                        : 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Контекст</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.connection || 'Не указано'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Заметки</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.entry?.notes || 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Триггеры</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.entry?.triggers && selectedPoint.entry.triggers.length > 0
                        ? selectedPoint.entry.triggers.join(', ')
                        : 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Физические ощущения</h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.entry?.physical_sensations && selectedPoint.entry.physical_sensations.length > 0
                        ? selectedPoint.entry.physical_sensations.join(', ')
                        : 'Не указано'}
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

export default MoodEmotionsChart;
