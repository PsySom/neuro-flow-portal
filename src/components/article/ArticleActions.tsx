
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Download, Share2 } from 'lucide-react';

interface ArticleActionsProps {
  isLiked: boolean;
  likes: number;
  onLike: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const ArticleActions: React.FC<ArticleActionsProps> = ({
  isLiked,
  likes,
  onLike,
  onDownload,
  onShare
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onLike}
        className={`${isLiked ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
      >
        <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-600' : ''}`} />
        {likes}
      </Button>
      
      <Button variant="outline" size="sm" onClick={onDownload}>
        <Download className="w-4 h-4 mr-2" />
        Скачать
      </Button>
      
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share2 className="w-4 h-4 mr-2" />
        Поделиться
      </Button>
    </div>
  );
};

export default ArticleActions;
