
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Stethoscope, Wrench, ChevronRight } from 'lucide-react';

interface AccordionNavProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const ArticleAccordionNav: React.FC<AccordionNavProps> = ({ activeSection, onSectionClick }) => {
  const sections = [
    {
      id: 'concepts',
      title: 'Основы депрессии',
      icon: BookOpen,
      subsections: [
        { id: 'что-такое-депрессия', title: 'Что такое депрессия?' },
        { id: 'на-что-влияет-депрессия', title: 'На что влияет депрессия?' },
        { id: 'как-проявляется-депрессия', title: 'Как проявляется депрессия' },
        { id: 'какая-бывает-депрессия', title: 'Какая бывает депрессия' },
        { id: 'причины-и-механизмы-развития', title: 'Причины и механизмы развития' },
        { id: 'как-исследовали-и-открывали-депрессию', title: 'Как исследовали и открывали депрессию' }
      ]
    },
    {
      id: 'practical',
      title: 'Диагностика и лечение',
      icon: Stethoscope,
      subsections: [
        { id: 'диагностика-депрессии', title: 'Диагностика: как распознать депрессию' },
        { id: 'лечение-депрессии', title: 'Как лечат депрессию' },
        { id: 'профилактика-и-самопомощь', title: 'Профилактика и самопомощь' },
        { id: 'помощь-близкому-с-депрессией', title: 'Как помочь близкому с депрессией' },
        { id: 'источники', title: 'Источники и полезные ссылки' }
      ]
    },
    {
      id: 'resources',
      title: 'Инструменты и ресурсы',
      icon: Wrench,
      subsections: [
        { id: 'tests', title: 'Диагностические тесты' },
        { id: 'diaries', title: 'Дневники для работы с депрессией' },
        { id: 'exercises', title: 'Упражнения и практики' }
      ]
    }
  ];

  const getActiveValue = () => {
    for (const section of sections) {
      if (activeSection === section.id || section.subsections.some(sub => sub.id === activeSection)) {
        return section.id;
      }
    }
    return sections[0].id;
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-4 text-emerald-700">Содержание статьи</h3>
        
        <Accordion type="single" value={getActiveValue()} collapsible className="w-full">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActiveSection = activeSection === section.id || section.subsections.some(sub => sub.id === activeSection);
            
            return (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger 
                  className={`hover:no-underline px-2 py-3 rounded-lg transition-colors ${
                    isActiveSection ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onSectionClick(`section-${section.id}`)}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pb-0">
                  <div className="ml-6 space-y-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => onSectionClick(subsection.id)}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center space-x-2 ${
                          activeSection === subsection.id
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        <span>{subsection.title}</span>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ArticleAccordionNav;
