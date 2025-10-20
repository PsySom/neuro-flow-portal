import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'br', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id']
    });
  }, [content]);

  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <ScrollArea className="h-auto">
          <div 
            className="prose prose-lg max-w-none prose-emerald"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
