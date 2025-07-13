import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Timer, Users, Share2, Calendar, Clock, Heart } from 'lucide-react';
import { contentTypes } from '@/constants/practicesConstants';
import { useAuth } from '@/contexts/AuthContext';
import LoginPromptDialog from './LoginPromptDialog';
import CreateActivityFromPracticeDialog from './CreateActivityFromPracticeDialog';
import BreathingAnimationDialog from './BreathingAnimationDialog';

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
  instructions?: string;
  questions?: string[] | { question: string; options: string[]; }[];
  keys?: string;
  responseFormat?: string;
}

interface PracticeContentCardProps {
  item: ContentItem;
  handleShare: (title: string) => void;
  onOpenDetail: (item: ContentItem) => void;
}

const PracticeContentCard: React.FC<PracticeContentCardProps> = ({ item, handleShare, onOpenDetail }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 100) + 10);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCreateActivityDialog, setShowCreateActivityDialog] = useState(false);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSchedule = (title: string) => {
    console.log(`Запланировать: ${title}`);
    
    if (!isAuthenticated) {
      setShowLoginDialog(true);
    } else {
      setShowCreateActivityDialog(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowCreateActivityDialog(true);
  };

  const handlePostpone = (title: string) => {
    console.log(`Отложить: ${title}`);
    // Здесь будет логика откладывания упражнения
  };

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Функция для получения цвета рамки и фона на основе градиента кнопки
  const getCardStyling = (color: string) => {
    if (color.includes('blue')) {
      return {
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50/50'
      };
    } else if (color.includes('green') || color.includes('emerald')) {
      return {
        borderColor: 'border-green-500',
        bgColor: 'bg-green-50/50'
      };
    } else if (color.includes('purple')) {
      return {
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-50/50'
      };
    } else if (color.includes('orange')) {
      return {
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-50/50'
      };
    } else if (color.includes('red') || color.includes('rose')) {
      return {
        borderColor: 'border-red-500',
        bgColor: 'bg-red-50/50'
      };
    } else if (color.includes('indigo')) {
      return {
        borderColor: 'border-indigo-500',
        bgColor: 'bg-indigo-50/50'
      };
    } else if (color.includes('yellow')) {
      return {
        borderColor: 'border-yellow-500',
        bgColor: 'bg-yellow-50/50'
      };
    } else if (color.includes('pink')) {
      return {
        borderColor: 'border-pink-500',
        bgColor: 'bg-pink-50/50'
      };
    } else if (color.includes('teal')) {
      return {
        borderColor: 'border-teal-500',
        bgColor: 'bg-teal-50/50'
      };
    } else {
      return {
        borderColor: 'border-gray-300',
        bgColor: 'bg-gray-50/50'
      };
    }
  };

  const cardStyling = getCardStyling(item.color);

  return (
    <>
      <Card className={`hover:shadow-lg transition-all duration-300 border-2 ${cardStyling.borderColor} ${cardStyling.bgColor}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <button 
              onClick={() => {
                if (item.title.includes('Дыхание 4-7-8') || item.title.includes('Дыхательная техника 4-7-8')) {
                  setShowBreathingAnimation(true);
                } else {
                  onOpenDetail(item);
                }
              }}
              className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform`}
            >
              <Play className="w-8 h-8 text-white" />
            </button>
            
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
                {item.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <Button 
                  className={`bg-gradient-to-r ${item.color} hover:shadow-lg transition-all duration-200`}
                  onClick={() => onOpenDetail(item)}
                >
                  Попробовать сейчас
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSchedule(item.title)}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Запланировать
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePostpone(item.title)}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Отложить
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleShare(item.title)}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Поделиться
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
                  {likesCount}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <LoginPromptDialog 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />

      <CreateActivityFromPracticeDialog
        open={showCreateActivityDialog}
        onOpenChange={setShowCreateActivityDialog}
        practiceItem={item}
      />

      <BreathingAnimationDialog
        open={showBreathingAnimation}
        onOpenChange={setShowBreathingAnimation}
      />
    </>
  );
};

export default PracticeContentCard;
