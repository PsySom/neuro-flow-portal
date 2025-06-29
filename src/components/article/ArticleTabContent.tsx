
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, BookOpen, Stethoscope, Wrench } from 'lucide-react';
import ArticleBasicConcepts from './ArticleBasicConcepts';
import ArticlePracticalAspects from './ArticlePracticalAspects';
import ArticleResourcesAndTools from './ArticleResourcesAndTools';

interface ArticleTabContentProps {
  content: string;
}

const ArticleTabContent: React.FC<ArticleTabContentProps> = ({ content }) => {
  const [activeSection, setActiveSection] = useState('concepts');

  const sections = [
    {
      id: 'concepts',
      title: 'Основы депрессии',
      icon: BookOpen,
      description: 'Что такое депрессия, как проявляется, причины и механизмы',
      subsections: [
        'Что такое депрессия?',
        'На что влияет депрессия?',
        'Как проявляется депрессия',
        'Какая бывает депрессия',
        'Причины и механизмы развития',
        'Как исследовали и открывали депрессию'
      ]
    },
    {
      id: 'practical',
      title: 'Диагностика и лечение',
      icon: Stethoscope,
      description: 'Диагностика, методы лечения, профилактика и поддержка',
      subsections: [
        'Диагностика: как распознать депрессию',
        'Как лечат депрессию',
        'Профилактика и самопомощь',
        'Как помочь близкому с депрессией',
        'Источники и полезные ссылки'
      ]
    },
    {
      id: 'resources',
      title: 'Инструменты и ресурсы',
      icon: Wrench,
      description: 'Тесты, дневники и упражнения для работы с депрессией',
      subsections: [
        'Диагностические тесты',
        'Дневники для работы с депрессией',
        'Упражнения и практики'
      ]
    }
  ];

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const conceptsEl = document.getElementById('section-concepts');
      const practicalEl = document.getElementById('section-practical');
      const resourcesEl = document.getElementById('section-resources');
      
      const scrollPosition = window.scrollY + 150;

      if (resourcesEl && resourcesEl.offsetTop <= scrollPosition) {
        setActiveSection('resources');
      } else if (practicalEl && practicalEl.offsetTop <= scrollPosition) {
        setActiveSection('practical');
      } else if (conceptsEl && conceptsEl.offsetTop <= scrollPosition) {
        setActiveSection('concepts');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Основное содержание - вертикально */}
      <Card className="mb-8">
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

      {/* Мини-окна навигации */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Card 
              key={section.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isActive 
                  ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200' 
                  : 'hover:border-emerald-300'
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isActive 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isActive ? 'text-emerald-700' : 'text-gray-900'
                    }`}>
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {section.description}
                    </p>
                    
                    <div className="space-y-2">
                      {section.subsections.map((subsection, index) => (
                        <div 
                          key={index}
                          className="flex items-center text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">{subsection}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      <span>• Активный раздел</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Подсказка для пользователя */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">💡</span>
            </div>
            <div>
              <p className="text-blue-800 text-sm">
                <strong>Совет:</strong> Нажмите на любое из окошек выше, чтобы быстро перейти к нужному разделу статьи.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleTabContent;
