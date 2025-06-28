
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <ScrollArea className="h-auto">
          <div 
            className="prose prose-lg max-w-none prose-emerald"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ArticleContent;
