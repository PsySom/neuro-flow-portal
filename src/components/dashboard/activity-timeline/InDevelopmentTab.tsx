
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const InDevelopmentTab: React.FC = () => {
  return (
    <Card className="h-64 flex items-center justify-center">
      <CardContent className="text-center space-y-4">
        <Construction className="w-16 h-16 text-gray-400 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-600">В разработке</h3>
          <p className="text-gray-500">
            Эта функция находится в разработке и скоро будет доступна.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InDevelopmentTab;
