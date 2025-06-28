
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface RecommendedTool {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: LucideIcon;
  category: string;
  link: string;
}

interface RecommendedToolsProps {
  tools: RecommendedTool[];
}

const RecommendedTools: React.FC<RecommendedToolsProps> = ({ tools }) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-emerald-200">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🎯 Рекомендуемые тесты, дневники и упражнения
        </h2>
        <p className="text-gray-600 mb-6">
          Эти научно обоснованные инструменты помогут вам применить знания из статьи на практике, 
          оценить своё состояние и развить навыки работы с депрессией, эмоциями и мыслями.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <tool.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {tool.type === 'diary' ? 'Дневник' : tool.type === 'test' ? 'Тест' : 'Упражнение'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(tool.link)}
                        className="hover:bg-emerald-50"
                      >
                        {tool.type === 'diary' ? 'Открыть дневник' : tool.type === 'test' ? 'Пройти тест' : 'Попробовать'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 mr-4"
            onClick={() => navigate('/practices')}
          >
            Все упражнения и практики
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/diaries')}
          >
            Все дневники
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTools;
