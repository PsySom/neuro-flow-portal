import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock } from 'lucide-react';

const KnowledgeBase = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: 2,
      title: 'Депрессия XXI века: наука, эмоции и путь к восстановлению',
      description: 'Полный научно-популярный обзор депрессивных расстройств: виды, механизмы развития, симптомы и современные подходы к лечению.',
      readTime: '25 мин чтения',
      tags: ['Депрессия', 'Аффективные расстройства', 'Диагностика', 'Лечение'],
      views: 3250
    },
    {
      id: 3,
      title: 'В ритме человека: циклы напряжения и расслабления',
      description: 'Научно обоснованная статья о том, как работают наши внутренние ритмы и почему важно соблюдать баланс между активностью и отдыхом.',
      readTime: '20 мин чтения',
      tags: ['Ритмы', 'Саморегуляция', 'Нейрофизиология', 'Восстановление'],
      views: 1850
    },
    {
      id: 4,
      title: 'Самооценка: современный взгляд, связь с самокритикой и самоподдержкой',
      description: 'Глубокий анализ самооценки с точки зрения современной психологии: как формируется, связь с самокритикой и практики самосострадания.',
      readTime: '20 мин чтения',
      tags: ['Самооценка', 'Самокритика', 'Самосострадание', 'Психология личности'],
      views: 1240
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            База знаний
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Научно обоснованные статьи по психологии и психическому здоровью
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {articles.map((article) => (
            <Card key={article.id} className="border-2 border-psybalans-border hover:border-psybalans-primary transition-all duration-300 group cursor-pointer hover:shadow-lg bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg group-hover:text-psybalans-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>👁 {article.views}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {article.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-psybalans-primary/10 text-psybalans-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/article/${article.id}`)}
                  className="w-full"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Читать статью
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-psybalans-primary/5 to-psybalans-secondary/5 border-psybalans-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Развивайтесь вместе с нами
              </h2>
              <p className="text-muted-foreground mb-6">
                Регулярно добавляем новые материалы для вашего психологического благополучия
              </p>
              <Button className="bg-psybalans-primary hover:bg-psybalans-secondary">
                Больше статей скоро
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KnowledgeBase;