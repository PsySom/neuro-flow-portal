
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getMoodEmoji } from '../diaries/moodDiaryUtils';
import { backendDiaryService, MoodEntry } from '@/services/backend-diary.service';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ChartDataPoint {
  time: string;
  mood: number;
  emotions?: string[];
  emotionIntensity?: string;
  connection?: string;
  impact?: string;
  fullDate?: string;
  entry?: MoodEntry;
}

type TimeRange = 'day' | 'week' | 'month' | '30days';

const MoodEmotionsChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Преобразование данных API в формат для графика
  const convertMoodEntriesToChartData = (entries: MoodEntry[], range: TimeRange): ChartDataPoint[] => {
    // Для 30-дневного периода группируем записи по дням и вычисляем среднее
    if (range === '30days') {
      const dailyGrouped = new Map<string, { moods: number[], emotions: string[], entries: MoodEntry[] }>();
      
      entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayKey = format(date, 'dd.MM');
        const normalizedMood = Math.round(entry.mood_score / 2);
        const emotions = entry.emotions?.map(emotion => emotion.name) || [];
        
        if (!dailyGrouped.has(dayKey)) {
          dailyGrouped.set(dayKey, { moods: [], emotions: [], entries: [] });
        }
        
        const dayData = dailyGrouped.get(dayKey)!;
        dayData.moods.push(normalizedMood);
        dayData.emotions.push(...emotions);
        dayData.entries.push(entry);
      });
      
      const convertedData: ChartDataPoint[] = [];
      for (const [dayKey, dayData] of dailyGrouped.entries()) {
        const avgMood = Math.round(dayData.moods.reduce((sum, mood) => sum + mood, 0) / dayData.moods.length);
        const uniqueEmotions = [...new Set(dayData.emotions)];
        const latestEntry = dayData.entries[dayData.entries.length - 1];
        
        convertedData.push({
          time: dayKey,
          mood: avgMood,
          emotions: uniqueEmotions,
          connection: latestEntry.context || '',
          fullDate: format(new Date(latestEntry.timestamp), 'dd.MM.yyyy'),
          entry: latestEntry
        });
      }
      
      return convertedData.sort((a, b) => {
        const [dayA, monthA] = a.time.split('.').map(Number);
        const [dayB, monthB] = b.time.split('.').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });
    }

    const convertedData: ChartDataPoint[] = [];

    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      
      // Преобразуем шкалу API (-10 до 10) в шкалу UI (-5 до 5)
      const normalizedMood = Math.round(entry.mood_score / 2);
      
      let timeLabel: string;
      
      if (range === 'day') {
        timeLabel = format(date, 'HH:mm');
      } else if (range === 'week') {
        timeLabel = format(date, 'EEE', { locale: ru });
      } else {
        timeLabel = format(date, 'd');
      }

      // Извлекаем эмоции из массива emotions
      const emotions = entry.emotions?.map(emotion => emotion.name) || [];

      convertedData.push({
        time: timeLabel,
        mood: normalizedMood,
        emotions,
        connection: entry.context || '',
        fullDate: format(date, 'dd.MM.yyyy HH:mm'),
        entry
      });
    });

    return convertedData.sort((a, b) => {
      if (range === 'month') {
        return parseInt(a.time) - parseInt(b.time);
      }
      return a.time.localeCompare(b.time);
    });
  };

  // Получение данных из API
  const fetchMoodData = async (range: TimeRange) => {
    setIsLoading(true);
    try {
      const now = new Date();
      let startDate: Date, endDate: Date;

      if (range === 'day') {
        startDate = startOfDay(now);
        endDate = endOfDay(now);
      } else if (range === 'week') {
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
      } else if (range === '30days') {
        startDate = subDays(now, 30);
        endDate = endOfDay(now);
      } else {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
      }

      const entries = await backendDiaryService.getMoodEntries({
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        sort_desc: false
      });

      const chartData = convertMoodEntriesToChartData(entries, range);
      setChartData(chartData);
    } catch (error) {
      console.error('Ошибка при загрузке данных настроения:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка данных при изменении диапазона времени
  useEffect(() => {
    fetchMoodData(timeRange);
  }, [timeRange]);

  const currentData = chartData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${data.mood}`}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getMoodEmoji(data.mood)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props;
    
    return (
      <g>
        <circle 
          cx={cx} 
          cy={cy} 
          r={8} 
          fill="white" 
          stroke="#3b82f6" 
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => setSelectedPoint(payload)}
        />
        {/* Для 30-дневного и месячного графика показываем эмоджи только для каждого третьего дня */}
        {(timeRange !== 'month' && timeRange !== '30days' || index % 3 === 0) && (
          <text 
            x={cx} 
            y={cy - 20} 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontSize="24"
            className="pointer-events-none"
            style={{ fontSize: '24px' }}
          >
            {getMoodEmoji(payload.mood)}
          </text>
        )}
      </g>
    );
  };

  // Определяем ширину линии в зависимости от периода
  const getLineWidth = () => {
    if (timeRange === '30days') return 3; // Средняя толщина для 30-дневного периода
    return timeRange === 'month' ? 4 : 2; // На 40% толще для месяца
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>График настроения и эмоций</span>
            <div className="flex space-x-2">
              <Button
                variant={timeRange === '30days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30days')}
              >
                30 дней
              </Button>
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                Неделя
              </Button>
              <Button
                variant={timeRange === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('day')}
              >
                День
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
                  <XAxis dataKey="time" />
                  <YAxis domain={[-5, 5]} />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3b82f6" 
                    strokeWidth={getLineWidth()}
                    dot={<CustomDot />}
                    connectNulls={false}
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
          {selectedPoint && timeRange !== 'month' && timeRange !== '30days' ? (
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
              <p className="text-sm">Подробности доступны для режимов "День" и "Неделя"</p>
              {timeRange === '30days' && (
                <p className="text-sm mt-2">В режиме "30 дней" показываются усредненные данные по дням</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodEmotionsChart;
