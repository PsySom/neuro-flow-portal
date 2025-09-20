import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSleepDiary } from '@/hooks/useSleepDiary';

interface SleepChartData {
  date: string;
  sleepDuration: number;
  sleepQuality: number;
  morningFeeling: number;
  nightAwakenings: number;
}

const SleepChart = () => {
  const { entries, loading, error } = useSleepDiary();
  const [chartData, setChartData] = useState<SleepChartData[]>([]);

  useEffect(() => {
    if (entries.length > 0) {
      const data = entries.map(entry => ({
        date: new Date(entry.created_at || '').toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
        sleepDuration: entry.sleep_duration,
        sleepQuality: entry.sleep_quality,
        morningFeeling: entry.morning_feeling,
        nightAwakenings: entry.night_awakenings
      })).reverse(); // Показываем от старых к новым
      
      setChartData(data);
    }
  }, [entries]);

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
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Нет данных для отображения</p>
            <p className="text-sm">Начните вести дневник сна, чтобы увидеть статистику</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Продолжительность сна */}
      <Card>
        <CardHeader>
          <CardTitle>Продолжительность сна</CardTitle>
          <CardDescription>Количество часов сна по дням</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 12]} />
              <Tooltip 
                formatter={(value: number) => [`${value} ч`, 'Продолжительность']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="sleepDuration" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Качество сна */}
      <Card>
        <CardHeader>
          <CardTitle>Качество сна</CardTitle>
          <CardDescription>Оценка качества сна от -5 до +5</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis domain={[-5, 5]} />
              <Tooltip 
                formatter={(value: number) => [value, 'Качество']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="sleepQuality" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Утреннее самочувствие */}
      <Card>
        <CardHeader>
          <CardTitle>Утреннее самочувствие</CardTitle>
          <CardDescription>Оценка самочувствия утром от 1 до 10</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip 
                formatter={(value: number) => [value, 'Самочувствие']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="morningFeeling" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ночные пробуждения */}
      <Card>
        <CardHeader>
          <CardTitle>Ночные пробуждения</CardTitle>
          <CardDescription>Количество пробуждений за ночь</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value, 'Пробуждения']}
                labelFormatter={(label) => `Дата: ${label}`}
              />
              <Bar 
                dataKey="nightAwakenings" 
                fill="hsl(var(--chart-4))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepChart;