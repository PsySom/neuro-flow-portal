
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Timer, Users, Share2 } from 'lucide-react';
import { contentTypes } from '@/constants/practicesConstants';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: string;
  level: string;
  participants: string;
  category: string;
  therapyMethods: string[];
  problems: string[];
  objects: string[];
  tags: string[];
  color: string;
}

interface PracticeContentCardProps {
  item: ContentItem;
  handleShare: (title: string) => void;
}

const PracticeContentCard: React.FC<PracticeContentCardProps> = ({ item, handleShare }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Play className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Timer className="w-4 h-4" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{item.participants}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.level}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {contentTypes.find(t => t.id === item.type)?.label}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button className={`bg-gradient-to-r ${item.color} hover:shadow-lg transition-all duration-200`}>
                Попробовать сейчас
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShare(item.title)}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Поделиться
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeContentCard;
