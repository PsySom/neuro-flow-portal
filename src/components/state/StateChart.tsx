import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { StateMetric } from '@/hooks/useStateMetrics';

interface StateChartProps {
  metrics: StateMetric[];
}

export const StateChart: React.FC<StateChartProps> = ({ metrics }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || metrics.length === 0) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Prepare data
    const timestamps = metrics.map(m => m.timestamp);
    const moodData = metrics.map(m => m.mood);
    const energyData = metrics.map(m => m.energy);
    const stressData = metrics.map(m => m.stress);

    // Get CSS variables for colors
    const style = getComputedStyle(document.documentElement);
    const primaryColor = `hsl(${style.getPropertyValue('--primary')})`;
    const secondaryColor = `hsl(${style.getPropertyValue('--secondary')})`;
    const accentColor = `hsl(${style.getPropertyValue('--accent')})`;

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: primaryColor,
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        data: ['Настроение', 'Энергия', 'Стресс'],
        textStyle: {
          color: style.getPropertyValue('--foreground')
        },
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLine: {
          lineStyle: {
            color: style.getPropertyValue('--border')
          }
        },
        axisLabel: {
          color: style.getPropertyValue('--muted-foreground')
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10,
        axisLine: {
          lineStyle: {
            color: style.getPropertyValue('--border')
          }
        },
        axisLabel: {
          color: style.getPropertyValue('--muted-foreground')
        },
        splitLine: {
          lineStyle: {
            color: style.getPropertyValue('--border'),
            opacity: 0.3
          }
        }
      },
      series: [
        {
          name: 'Настроение',
          type: 'line',
          smooth: true,
          data: moodData,
          itemStyle: {
            color: primaryColor
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: primaryColor.replace(')', ', 0.3)').replace('hsl', 'hsla') },
              { offset: 1, color: primaryColor.replace(')', ', 0.05)').replace('hsl', 'hsla') }
            ])
          }
        },
        {
          name: 'Энергия',
          type: 'line',
          smooth: true,
          data: energyData,
          itemStyle: {
            color: secondaryColor
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: secondaryColor.replace(')', ', 0.3)').replace('hsl', 'hsla') },
              { offset: 1, color: secondaryColor.replace(')', ', 0.05)').replace('hsl', 'hsla') }
            ])
          }
        },
        {
          name: 'Стресс',
          type: 'line',
          smooth: true,
          data: stressData,
          itemStyle: {
            color: accentColor
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: accentColor.replace(')', ', 0.3)').replace('hsl', 'hsla') },
              { offset: 1, color: accentColor.replace(')', ', 0.05)').replace('hsl', 'hsla') }
            ])
          }
        }
      ]
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [metrics]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      className="w-full h-[400px]"
      style={{ minHeight: '400px' }}
    />
  );
};
