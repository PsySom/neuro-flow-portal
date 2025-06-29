
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ArticleBasicConcepts from './ArticleBasicConcepts';
import ArticlePracticalAspects from './ArticlePracticalAspects';
import ArticleResourcesAndTools from './ArticleResourcesAndTools';
import ArticleAccordionNav from './ArticleAccordionNav';

interface ArticleTabContentProps {
  content: string;
}

const ArticleTabContent: React.FC<ArticleTabContentProps> = ({ content }) => {
  const [activeSection, setActiveSection] = useState('что-такое-депрессия');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'что-такое-депрессия',
        'на-что-влияет-депрессия',
        'как-проявляется-депрессия',
        'какая-бывает-депрессия',
        'причины-и-механизмы-развития',
        'как-исследовали-и-открывали-депрессию',
        'диагностика-депрессии',
        'лечение-депрессии',
        'профилактика-и-самопомощь',
        'помощь-близкому-с-депрессией',
        'источники',
        'tests',
        'diaries',
        'exercises'
      ];
      
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
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Аккордеон навигации - боковая панель */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <ArticleAccordionNav 
          activeSection={activeSection} 
          onSectionClick={scrollToSection} 
        />
      </div>

      {/* Основное содержание */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <Card>
          <CardContent className="p-8">
            <div className="space-y-12">
              <div id="section-concepts">
                <ArticleBasicConcepts />
              </div>
              
              <div id="section-practical">
                <ArticlePracticalAspects />
              </div>
              
              <div id="section-resources">
                <ArticleResourcesAndTools />
              </div>
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
