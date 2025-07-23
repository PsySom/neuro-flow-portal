
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
        const dayKey = format(date, 'dd');
        const normalizedMood = entry.mood_score; // Данные уже в формате -5/+5
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
      
      // Создаем полный диапазон от 1 до 30 дня
      for (let day = 1; day <= 30; day++) {
        const dayKey = day.toString().padStart(2, '0');
        const dayData = dailyGrouped.get(dayKey);
        
        if (dayData) {
          const avgMood = Math.round(dayData.moods.reduce((sum, mood) => sum + mood, 0) / dayData.moods.length);
          const uniqueEmotions = [...new Set(dayData.emotions)];
          const latestEntry = dayData.entries[dayData.entries.length - 1];
          
          convertedData.push({
            time: day.toString(),
            mood: avgMood,
            emotions: uniqueEmotions,
            connection: latestEntry.context || '',
            fullDate: format(new Date(latestEntry.timestamp), 'dd.MM.yyyy'),
            entry: latestEntry
          });
        }
      }
      
      return convertedData;
    }

    const convertedData: ChartDataPoint[] = [];

    if (range === 'day') {
      // Для дневного режима создаем временную сетку по часам
      const hourlyData = new Map<string, ChartDataPoint>();
      
      entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const hourKey = format(date, 'HH:mm');
        const normalizedMood = entry.mood_score; // Данные уже в формате -5/+5
        const emotions = entry.emotions?.map(emotion => emotion.name) || [];

        hourlyData.set(hourKey, {
          time: hourKey,
          mood: normalizedMood,
          emotions,
          connection: entry.context || '',
          fullDate: format(date, 'dd.MM.yyyy HH:mm'),
          entry
        });
      });

      // Сортируем по времени
      return Array.from(hourlyData.values()).sort((a, b) => a.time.localeCompare(b.time));
    }

    if (range === 'week') {
      // Для недельного режима группируем по дням недели
      const weeklyData = new Map<string, { moods: number[], emotions: string[], entries: MoodEntry[], date: Date }>();
      
      entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayKey = format(date, 'EEEE', { locale: ru });
        const normalizedMood = entry.mood_score; // Данные уже в формате -5/+5
        const emotions = entry.emotions?.map(emotion => emotion.name) || [];
        
        if (!weeklyData.has(dayKey)) {
          weeklyData.set(dayKey, { moods: [], emotions: [], entries: [], date });
        }
        
        const dayData = weeklyData.get(dayKey)!;
        dayData.moods.push(normalizedMood);
        dayData.emotions.push(...emotions);
        dayData.entries.push(entry);
      });

      const daysOrder = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
      
      return daysOrder.map(day => {
        const dayData = weeklyData.get(day);
        if (dayData) {
          const avgMood = Math.round(dayData.moods.reduce((sum, mood) => sum + mood, 0) / dayData.moods.length);
          const uniqueEmotions = [...new Set(dayData.emotions)];
          const latestEntry = dayData.entries[dayData.entries.length - 1];
          
          return {
            time: `${day.slice(0, 2)} ${format(dayData.date, 'dd.MM')}`,
            mood: avgMood,
            emotions: uniqueEmotions,
            connection: latestEntry.context || '',
            fullDate: format(new Date(latestEntry.timestamp), 'dd.MM.yyyy'),
            entry: latestEntry
          };
        }
        return null;
      }).filter(Boolean) as ChartDataPoint[];
    }

    if (range === 'month') {
      // Для месячного режима группируем по дням месяца
      const monthlyData = new Map<number, { moods: number[], emotions: string[], entries: MoodEntry[] }>();
      
      entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const day = date.getDate();
        const normalizedMood = entry.mood_score; // Данные уже в формате -5/+5
        const emotions = entry.emotions?.map(emotion => emotion.name) || [];
        
        if (!monthlyData.has(day)) {
          monthlyData.set(day, { moods: [], emotions: [], entries: [] });
        }
        
        const dayData = monthlyData.get(day)!;
        dayData.moods.push(normalizedMood);
        dayData.emotions.push(...emotions);
        dayData.entries.push(entry);
      });

      const convertedData: ChartDataPoint[] = [];
      for (let day = 1; day <= 31; day++) {
        const dayData = monthlyData.get(day);
        if (dayData) {
          const avgMood = Math.round(dayData.moods.reduce((sum, mood) => sum + mood, 0) / dayData.moods.length);
          const uniqueEmotions = [...new Set(dayData.emotions)];
          const latestEntry = dayData.entries[dayData.entries.length - 1];
          
          convertedData.push({
            time: day.toString(),
            mood: avgMood,
            emotions: uniqueEmotions,
            connection: latestEntry.context || '',
            fullDate: format(new Date(latestEntry.timestamp), 'dd.MM.yyyy'),
            entry: latestEntry
          });
        }
      }
      
      return convertedData;
    }

    return convertedData;
  };

  // Функция для генерации демо-данных локально
  const generateLocalDemoData = (range: TimeRange): ChartDataPoint[] => {
    const demoData: ChartDataPoint[] = [];
    const now = new Date();

    if (range === 'day') {
      // Дневной режим: от 00:00 до 24:00 (каждые 2 часа)
      for (let hour = 0; hour <= 24; hour += 2) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const mood = Math.floor(Math.random() * 11) - 5; // от -5 до +5
        demoData.push({
          time: timeString,
          mood,
          emotions: ['спокойствие', 'радость'].slice(0, Math.random() > 0.5 ? 1 : 2),
          connection: 'Демо-контекст',
          fullDate: format(now, 'dd.MM.yyyy') + ' ' + timeString
        });
      }
    } else if (range === 'week') {
      // Недельный режим: дни недели с датами
      const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - 6 + i);
        const dayName = daysOfWeek[i];
        const dateStr = format(date, 'dd.MM');
        const mood = Math.floor(Math.random() * 11) - 5;
        
        demoData.push({
          time: `${dayName} ${dateStr}`,
          mood,
          emotions: ['настроение', 'энергия'],
          connection: 'Демо-контекст недели',
          fullDate: format(date, 'dd.MM.yyyy')
        });
      }
    } else if (range === 'month' || range === '30days') {
      // Месячный режим: числа от 1 до 30
      for (let day = 1; day <= 30; day++) {
        const mood = Math.floor(Math.random() * 11) - 5;
        demoData.push({
          time: day.toString(),
          mood,
          emotions: ['настроение'],
          connection: 'Демо-контекст месяца',
          fullDate: `${day.toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`
        });
      }
    }

    return demoData;
  };

  // Получение данных из API с fallback на локальные демо-данные
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

      if (entries.length > 0) {
        const chartData = convertMoodEntriesToChartData(entries, range);
        setChartData(chartData);
      } else {
        // Если нет данных от API, используем локальные демо-данные
        console.log('🔄 Используем локальные демо-данные для', range);
        const demoData = generateLocalDemoData(range);
        setChartData(demoData);
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке данных настроения:', error);
      // В случае ошибки используем локальные демо-данные
      console.log('🔄 Fallback на локальные демо-данные');
      const demoData = generateLocalDemoData(range);
      setChartData(demoData);
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
                    strokeWidth={getLineWidth()}
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
