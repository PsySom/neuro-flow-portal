
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Heart, Zap, AlertCircle } from 'lucide-react';

const RecommendationsComponent = () => {
  return (
    <Card className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <span>Рекомендации</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Дыхательная практика</h4>
                <p className="text-sm text-blue-700">Попробуйте 5-минутное дыхательное упражнение для снижения стресса</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Перерыв на прогулку</h4>
                <p className="text-sm text-green-700">15-минутная прогулка поможет восстановить энергию</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900">Режим сна</h4>
                <p className="text-sm text-purple-700">Рекомендуем лечь спать на час раньше сегодня</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsComponent;
