import React from 'react';
import { Card } from '@/components/ui/card';
import { Smile, Zap, AlertCircle } from 'lucide-react';
import { StateMetric } from '@/hooks/useStateMetrics';

interface TodayMetricsProps {
  metrics: StateMetric | null;
}

export const TodayMetrics: React.FC<TodayMetricsProps> = ({ metrics }) => {
  const getMetricColor = (value: number) => {
    if (value >= 7) return 'text-green-600 dark:text-green-400';
    if (value >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMetricBg = (value: number) => {
    if (value >= 7) return 'bg-green-100 dark:bg-green-900/20';
    if (value >= 4) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const metricItems = [
    {
      icon: Smile,
      label: 'Настроение',
      value: metrics?.mood || 0,
      color: 'text-primary'
    },
    {
      icon: Zap,
      label: 'Энергия',
      value: metrics?.energy || 0,
      color: 'text-secondary'
    },
    {
      icon: AlertCircle,
      label: 'Стресс',
      value: metrics?.stress || 0,
      color: 'text-accent'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${getMetricColor(item.value)}`}>
                    {item.value.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
              </div>
              <div className={`rounded-full p-3 ${getMetricBg(item.value)}`}>
                <Icon className={`w-6 h-6 ${getMetricColor(item.value)}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-secondary/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.value >= 7 ? 'bg-green-500' :
                    item.value >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(item.value / 10) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
