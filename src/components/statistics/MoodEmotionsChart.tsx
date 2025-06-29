
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getMoodEmoji } from '../diaries/moodDiaryUtils';

// Тестовые данные
const mockData = {
  day: [
    { time: 'Утро', mood: 2, emotions: ['радость', 'спокойствие'], emotionIntensity: 'средняя', connection: 'семья', impact: 'помогает продуктивности' },
    { time: 'День', mood: -1, emotions: ['тревога', 'усталость'], emotionIntensity: 'высокая', connection: 'работа', impact: 'мешает концентрации' },
    { time: 'Вечер', mood: 3, emotions: ['благодарность', 'умиротворение'], emotionIntensity: 'умеренная', connection: 'дом', impact: 'помогает расслабиться' }
  ],
  week: [
    { time: 'Пн', mood: 1, emotions: ['интерес'], emotionIntensity: 'слабая', connection: 'работа', impact: 'помогает развитию' },
    { time: 'Вт', mood: -2, emotions: ['раздражение'], emotionIntensity: 'высокая', connection: 'отношения', impact: 'мешает общению' },
    { time: 'Ср', mood: 0, emotions: ['спокойствие'], emotionIntensity: 'умеренная', connection: 'здоровье', impact: 'нейтрально' },
    { time: 'Чт', mood: 3, emotions: ['радость'], emotionIntensity: 'высокая', connection: 'друзья', impact: 'поднимает настроение' },
    { time: 'Пт', mood: 2, emotions: ['гордость'], emotionIntensity: 'средняя', connection: 'цели', impact: 'мотивирует' },
    { time: 'Сб', mood: 4, emotions: ['любовь'], emotionIntensity: 'очень высокая', connection: 'семья', impact: 'дает энергию' },
    { time: 'Вс', mood: 1, emotions: ['ностальгия'], emotionIntensity: 'слабая', connection: 'творчество', impact: 'вдохновляет' }
  ],
  month: [
    { time: '1', mood: 2, peak: true },
    { time: '5', mood: -3, peak: true },
    { time: '10', mood: 1, peak: false },
    { time: '15', mood: 4, peak: true },
    { time: '20', mood: -1, peak: false },
    { time: '25', mood: 3, peak: true },
    { time: '30', mood: 0, peak: false }
  ]
};

type TimeRange = 'day' | 'week' | 'month';

const MoodEmotionsChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const currentData = mockData[timeRange];

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
    
    // Для месячного графика показываем точки только для определенных дней месяца
    if (timeRange === 'month') {
      const dayNumber = parseInt(payload.time);
      const targetDays = [1, 3, 5, 7, 9, 11, 13, 16, 18, 20, 21, 23, 25, 27, 29];
      if (!targetDays.includes(dayNumber)) {
        return null;
      }
    }
    
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
      </g>
    );
  };

  // Определяем ширину линии в зависимости от периода
  const getLineWidth = () => {
    return timeRange === 'month' ? 4 : 2; // На 40% толще для месяца (2 * 1.4 ≈ 3, округлим до 4)
  };

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
        </CardContent>
      </Card>

      {/* Панель подробностей */}
      <Card>
        <CardHeader>
          <CardTitle>Подробности точки настроения</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPoint && timeRange !== 'month' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <span className="text-2xl mr-2">{getMoodEmoji(selectedPoint.mood)}</span>
                      Настроение: {selectedPoint.mood}
                    </h4>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Какие чувства?</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPoint.emotions?.join(', ') || 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Какой силы?</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPoint.emotionIntensity || 'Не указано'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">С чем было связано?</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPoint.connection || 'Не указано'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">На что повлияло?</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedPoint.impact || 'Не указано'}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodEmotionsChart;
