
import React, { useState, useEffect } from 'react';
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
  
  // Определяем правильный articleId на основе переданного ID (синхронизируем с ArticleView)
  const getArticleId = (id: string | undefined) => {
    if (id === '2') return 2; // Депрессия
    if (id === '3') return 3; // Циклы 
    if (id === '4') return 4; // Самооценка
    if (id === '8') return 3; // Старая ссылка на циклы
    return parseInt(id || '0') || undefined;
  };

  const articleId = getArticleId(id);
  
  const tableOfContents = getArticleTableOfContents(articleId);
  const recommendedTools = getRecommendedTools(articleId);
  
  const [activeSection, setActiveSection] = useState(tableOfContents[0]?.id || '');
  const [showRecommendedTools, setShowRecommendedTools] = useState(false);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => item.id);
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'рекомендуемые-практики') {
      setShowRecommendedTools(true);
      setTimeout(() => {
        const element = document.getElementById('recommended-tools-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Добавляем пункт "Рекомендуемые практики" в оглавление
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
              dangerouslySetInnerHTML={{ __html: content }}
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
