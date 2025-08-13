import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Heart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PracticeActionsProps {
  itemTitle: string;
  onBreathingStart?: () => void;
  showBreathingButton?: boolean;
}

const PracticeActions: React.FC<PracticeActionsProps> = ({
  itemTitle,
  onBreathingStart,
  showBreathingButton = false
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Убрано из избранного" : "Добавлено в избранное",
      description: `"${itemTitle}"`,
    });
  };

  const handleRating = (value: number) => {
    setRating(value);
    toast({
      title: "Оценка сохранена",
      description: `Вы оценили "${itemTitle}" на ${value} звезд`,
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Запланировано",
      description: `"${itemTitle}" добавлено в расписание`,
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {showBreathingButton && onBreathingStart && (
        <Button onClick={onBreathingStart}>
          <Play className="w-4 h-4 mr-2" />
          Начать практику
        </Button>
      )}
      
      <Button variant="outline" onClick={handleSchedule}>
        <Calendar className="w-4 h-4 mr-2" />
        Запланировать
      </Button>
      
      <Button 
        variant={isLiked ? "default" : "outline"} 
        onClick={handleLike}
      >
        <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
        {isLiked ? 'В избранном' : 'В избранное'}
      </Button>
      
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className="p-1"
          >
            <Star 
              className={`w-4 h-4 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeActions;