
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';

interface ArticleMetadataProps {
  readTime: string;
  views: number;
  tags: string[];
}

const ArticleMetadata: React.FC<ArticleMetadataProps> = ({ 
  readTime, 
  views, 
  tags 
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{views} просмотров</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default ArticleMetadata;
