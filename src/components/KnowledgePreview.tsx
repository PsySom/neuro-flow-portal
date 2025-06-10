
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Headphones, ArrowRight } from 'lucide-react';

const KnowledgePreview = () => {
  const articles = [
    {
      type: 'article',
      icon: BookOpen,
      title: 'Нейробиология привычек: как мозг формирует автоматизмы',
      description: 'Научные исследования о том, как формируются и изменяются наши привычки на уровне нейронных связей.',
      readTime: '8 мин чтения',
      tags: ['Нейронаука', 'Привычки'],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'video',
      icon: Play,
      title: 'Техника "Якорения": управление эмоциональными состояниями',
      description: 'Практическое видео о том, как создавать положительные эмоциональные якоря.',
      readTime: '12 мин просмотра',
      tags: ['Практика', 'Эмоции'],
      color: 'bg-green-50 border-green-200'
    },
    {
      type: 'podcast',
      icon: Headphones,
      title: 'Подкаст: Циркадные ритмы и продуктивность',
      description: 'Интервью с хронобиологом о том, как использовать естественные ритмы организма.',
      readTime: '25 мин прослушивания',
      tags: ['Сон', 'Продуктивность'],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          База знаний
        </h2>
        <p className="text-lg text-gray-600">
          Научно обоснованные материалы для глубокого понимания себя
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article, index) => (
          <Card 
            key={index} 
            className={`${article.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <article.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {article.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center pt-4">
          <Button variant="outline" className="hover:bg-emerald-50 hover:border-emerald-300">
            Перейти в раздел базы знаний
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default KnowledgePreview;
