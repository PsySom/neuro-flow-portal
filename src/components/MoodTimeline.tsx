
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

const MoodTimeline = () => {
  const [selectedMetric, setSelectedMetric] = useState('mood');

  const timeData = [
    { time: '6:00', mood: 6, energy: 4, stress: 3 },
    { time: '9:00', mood: 7, energy: 8, stress: 5 },
    { time: '12:00', mood: 8, energy: 7, stress: 4 },
    { time: '15:00', mood: 6, energy: 5, stress: 6 },
    { time: '18:00', mood: 7, energy: 6, stress: 4 },
    { time: '21:00', mood: 8, energy: 4, stress: 2 },
  ];

  const metrics = [
    { id: 'mood', label: 'Настроение', color: 'emerald', icon: TrendingUp },
    { id: 'energy', label: 'Энергия', color: 'yellow', icon: Activity },
    { id: 'stress', label: 'Стресс', color: 'red', icon: TrendingDown },
  ];

  const getColorClasses = (color, value) => {
    const intensity = Math.min(10, Math.max(1, value));
    const opacity = intensity / 10;
    
    switch (color) {
      case 'emerald':
        return `bg-emerald-500 opacity-${Math.round(opacity * 100)}`;
      case 'yellow':
        return `bg-yellow-500 opacity-${Math.round(opacity * 100)}`;
      case 'red':
        return `bg-red-500 opacity-${Math.round(opacity * 100)}`;
      default:
        return 'bg-gray-500';
    }
  };

  const selectedColor = metrics.find(m => m.id === selectedMetric)?.color || 'emerald';

  return (
    <section className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ваша динамика в реальном времени
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Отслеживайте циклы настроения, энергии и стресса для понимания своих паттернов
        </p>
      </div>

      <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <span>Интерактивная лента состояния</span>
            </CardTitle>
            
            <div className="flex space-x-2">
              {metrics.map((metric) => (
                <Button
                  key={metric.id}
                  variant={selectedMetric === metric.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric(metric.id)}
                  className={selectedMetric === metric.id 
                    ? `bg-${metric.color}-500 hover:bg-${metric.color}-600` 
                    : `hover:bg-${metric.color}-50`
                  }
                >
                  <metric.icon className="w-4 h-4 mr-1" />
                  {metric.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* График-синусоида */}
          <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-6 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Сетка */}
              <defs>
                <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Линия тренда */}
              <path
                d={`M ${timeData.map((point, index) => 
                  `${(index * 100) + 50},${200 - (point[selectedMetric] * 20)}`
                ).join(' L ')}`}
                fill="none"
                stroke={selectedColor === 'emerald' ? '#10b981' : selectedColor === 'yellow' ? '#eab308' : '#ef4444'}
                strokeWidth="3"
                className="animate-fade-in"
              />
              
              {/* Точки данных */}
              {timeData.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={(index * 100) + 50}
                    cy={200 - (point[selectedMetric] * 20)}
                    r="6"
                    fill={selectedColor === 'emerald' ? '#10b981' : selectedColor === 'yellow' ? '#eab308' : '#ef4444'}
                    className="animate-scale-in hover:r-8 transition-all cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  />
                  
                  {/* Время */}
                  <text
                    x={(index * 100) + 50}
                    y="190"
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {point.time}
                  </text>
                  
                  {/* Значение */}
                  <text
                    x={(index * 100) + 50}
                    y={200 - (point[selectedMetric] * 20) - 15}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                  >
                    {point[selectedMetric]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Карточки состояния */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeData.slice(-3).map((point, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="text-sm text-gray-500 mb-2">{point.time}</div>
                <div className="space-y-2">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {metric.label}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${getColorClasses(metric.color, point[metric.id])}`}
                        />
                        <span className="text-sm font-bold text-gray-900">
                          {point[metric.id]}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="hover:bg-emerald-50">
              Добавить текущее состояние
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MoodTimeline;
