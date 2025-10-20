
import React, { useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import TableOfContents from './TableOfContents';
import RecommendedTools from './RecommendedTools';
import { getArticleTableOfContents, getRecommendedTools } from '../../data/articles';

interface ArticleTabContentProps {
  content: string;
}

const ArticleTabContent: React.FC<ArticleTabContentProps> = ({ content }) => {
  const { id } = useParams();
  
  // Sanitize HTML content
  const sanitizedContent = useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre', 'blockquote', 'br', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id']
    });
  }, [content]);
  
  // Определяем правильный articleId на основе переданного ID (синхронизируем с ArticleView)
  const getArticleId = (id: string | undefined) => {
...
  const enhancedTableOfContents = [
    ...tableOfContents,
    { id: 'рекомендуемые-практики', title: 'Рекомендуемые тесты, дневники и упражнения' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Оглавление - боковая панель */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <TableOfContents 
          items={enhancedTableOfContents}
          activeSection={activeSection} 
          onSectionClick={scrollToSection}
        />
      </div>

      {/* Основное содержание */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            
            {/* Рекомендуемые инструменты */}
            <div id="recommended-tools-section" className="mt-12">
              <RecommendedTools tools={recommendedTools} />
            </div>
          </CardContent>
        </Card>

        {/* Подсказка для пользователя */}
        <Card className="bg-blue-50 border-blue-200 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">💡</span>
              </div>
              <div>
                <p className="text-blue-800 text-sm">
                  <strong>Совет:</strong> Используйте навигацию слева для быстрого перехода к нужному разделу статьи.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticleTabContent;
