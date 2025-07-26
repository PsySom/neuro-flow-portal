
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface BalanceItem {
  label: string;
  value: number;
  color: string;
}

const BalanceWheelComponent = () => {
  const balanceData: BalanceItem[] = [
    { label: 'Работа', value: 75, color: 'bg-blue-500' },
    { label: 'Отдых', value: 60, color: 'bg-green-500' },
    { label: 'Спорт', value: 40, color: 'bg-yellow-500' },
    { label: 'Отношения', value: 80, color: 'bg-purple-500' },
    { label: 'Питание', value: 70, color: 'bg-red-500' },
    { label: 'Сон', value: 55, color: 'bg-indigo-500' }
  ];

  return (
    <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <span>Колесо баланса</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {balanceData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-gray-600">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceWheelComponent;
