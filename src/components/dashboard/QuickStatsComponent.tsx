
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smile, Battery } from 'lucide-react';

const QuickStatsComponent = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
        <CardContent className="p-4 text-center">
          <Smile className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-700">7.5</p>
          <p className="text-sm text-emerald-600">Настроение</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <CardContent className="p-4 text-center">
          <Battery className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-700">6.2</p>
          <p className="text-sm text-yellow-600">Энергия</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsComponent;
