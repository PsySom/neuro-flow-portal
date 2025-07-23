import React from 'react';
import { getMoodEmoji } from '../../diaries/moodDiaryUtils';
import { ChartDataPoint, TimeRange } from './chartDataConverters';

export const CustomTooltip = ({ active, payload, label }: any) => {
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

interface CustomDotProps {
  cx: number;
  cy: number;
  payload: ChartDataPoint;
  index: number;
  timeRange: TimeRange;
  onPointClick: (point: ChartDataPoint) => void;
}

export const CustomDot: React.FC<CustomDotProps> = ({ 
  cx, 
  cy, 
  payload, 
  index, 
  timeRange, 
  onPointClick 
}) => {
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
        onClick={() => onPointClick(payload)}
      />
      {/* Для месячного графика показываем эмоджи только для каждого третьего дня */}
      {(timeRange !== 'month' || index % 3 === 0) && (
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

export const getLineWidth = (timeRange: TimeRange) => {
  if (timeRange === 'month') return 4; // Толще для месяца
  return timeRange === 'week' ? 3 : 2; // Средняя для недели, тонкая для дня
};