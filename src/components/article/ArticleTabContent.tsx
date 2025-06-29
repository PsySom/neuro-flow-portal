
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleBasicConcepts from './ArticleBasicConcepts';
import ArticlePracticalAspects from './ArticlePracticalAspects';
import ArticleResourcesAndTools from './ArticleResourcesAndTools';

interface ArticleTabContentProps {
  content: string;
}

const ArticleTabContent: React.FC<ArticleTabContentProps> = ({ content }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <Tabs defaultValue="concepts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="concepts">Основы депрессии</TabsTrigger>
            <TabsTrigger value="practical">Диагностика и лечение</TabsTrigger>
            <TabsTrigger value="resources">Инструменты и ресурсы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="concepts">
            <ArticleBasicConcepts />
          </TabsContent>
          
          <TabsContent value="practical">
            <ArticlePracticalAspects />
          </TabsContent>
          
          <TabsContent value="resources">
            <ArticleResourcesAndTools />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ArticleTabContent;
