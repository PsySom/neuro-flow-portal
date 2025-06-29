
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ArticleMetadata from './ArticleMetadata';
import ArticleActions from './ArticleActions';

interface ArticleHeaderProps {
  title: string;
  readTime: string;
  views: number;
  tags: string[];
  isLiked: boolean;
  likes: number;
  onLike: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  readTime,
  views,
  tags,
  isLiked,
  likes,
  onLike,
  onDownload,
  onShare
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        className="mb-4 hover:bg-emerald-50"
        onClick={() => navigate('/knowledge')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Вернуться к базе знаний
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        <ArticleMetadata 
          readTime={readTime}
          views={views}
          tags={tags}
        />
        
        <ArticleActions
          isLiked={isLiked}
          likes={likes}
          onLike={onLike}
          onDownload={onDownload}
          onShare={onShare}
        />
      </div>
    </div>
  );
};

export default ArticleHeader;
