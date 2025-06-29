
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Stethoscope, Wrench, ChevronRight } from 'lucide-react';

interface AccordionNavProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const ArticleAccordionNav: React.FC<AccordionNavProps> = ({ activeSection, onSectionClick }) => {
  const [openAccordion, setOpenAccordion] = useState<string>('concepts');

  const sections = [
    {
      id: 'concepts',
      title: 'Что такое депрессия?',
      icon: BookOpen,
      subsections: [
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
        { id: 'профилактика-и-самопомощь', title: 'Профилактика и самопомощь' }
      ]
    },
    {
      id: 'resources',
      title: 'Рекомендуемые тесты, дневники и упражнения',
      icon: Wrench,
      subsections: [
        { id: 'tests', title: 'Диагностические тесты' },
        { id: 'diaries', title: 'Дневники для работы с депрессией' },
        { id: 'exercises', title: 'Упражнения и практики' }
      ]
    }
  ];

  const handleAccordionChange = (value: string) => {
    setOpenAccordion(value === openAccordion ? '' : value);
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(`section-${sectionId}`);
  };

  const handleSubsectionClick = (subsectionId: string) => {
    onSectionClick(subsectionId);
  };

  return (
    <Card className="sticky top-4 animate-fade-in">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-4 text-emerald-700">Содержание статьи</h3>
        
        <Accordion 
          type="single" 
          value={openAccordion} 
          onValueChange={handleAccordionChange}
          collapsible 
          className="w-full"
        >
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActiveSection = activeSection === section.id || section.subsections.some(sub => sub.id === activeSection);
            
            return (
              <AccordionItem key={section.id} value={section.id} className="border-b border-gray-100">
                <AccordionTrigger 
                  className={`hover:no-underline px-3 py-4 rounded-lg transition-all duration-300 ease-in-out ${
                    isActiveSection 
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 transition-all duration-200 ${
                      isActiveSection ? 'text-emerald-600' : 'text-gray-500'
                    }`} />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pb-2 overflow-hidden">
                  <div className="ml-8 space-y-1 animate-accordion-down">
                    {section.subsections.map((subsection, index) => (
                      <button
                        key={subsection.id}
                        onClick={() => handleSubsectionClick(subsection.id)}
                        className={`w-full text-left p-3 rounded-md text-sm transition-all duration-200 ease-in-out flex items-center space-x-2 transform hover:translate-x-1 ${
                          activeSection === subsection.id
                            ? 'bg-emerald-100 text-emerald-700 font-medium shadow-sm scale-105'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-all duration-200 ${
                          activeSection === subsection.id 
                            ? 'transform rotate-90 text-emerald-600' 
                            : 'text-gray-400'
                        }`} />
                        <span className="leading-relaxed">{subsection.title}</span>
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
