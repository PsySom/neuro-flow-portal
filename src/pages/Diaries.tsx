
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Clock, Users, ArrowRight, Target, Lightbulb, Heart, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Diaries = () => {
  const navigate = useNavigate();

  const diaries = [
    {
      id: 'mood',
      title: 'Дневник настроения',
      description: 'Отслеживайте свое эмоциональное состояние и выявляйте закономерности',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      duration: '5-10 мин',
      participants: '23.5k',
      tags: ['Эмоции', 'Настроение', 'Самонаблюдение'],
      features: ['Трекинг эмоций', 'Визуализация', 'Статистика'],
      path: '/mood-diary'
    },
    {
      id: 'thoughts',
      title: 'Дневник мыслей',
      description: 'Работайте с негативными мыслями и когнитивными искажениями',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      duration: '10-15 мин',
      participants: '18.2k',
      tags: ['КПТ', 'Мышление', 'Самоанализ'],
      features: ['8 шагов КПТ', 'Работа с искажениями', 'Альтернативы'],
      path: '/thoughts-diary'
    },
    {
      id: 'procrastination',
      title: 'Дневник прокрастинации',
      description: 'Анализируйте причины откладывания дел и находите решения',
      icon: Clock,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      duration: '8-12 мин',
      participants: '12.7k',
      tags: ['Продуктивность', 'Мотивация', 'Планирование'],
      features: ['Анализ задач', 'Поиск решений', 'Трекинг прогресса'],
      path: '/procrastination-diary'
    },
    {
      id: 'ocd',
      title: 'Дневник работы с ОКР',
      description: 'Отслеживайте обсессии и компульсии, работайте с навязчивостями',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      duration: '15-25 мин',
      participants: '8.9k',
      tags: ['ОКР', 'Навязчивости', 'Самоконтроль'],
      features: ['Детальный анализ', 'Практики сопротивления', 'Поддержка'],
      path: '/ocd-diary'
    },
    {
      id: 'self-esteem',
      title: 'Дневник самооценки',
      description: 'Развивайте самосострадание, работайте с самокритикой и самоподдержкой',
      icon: Smile,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      duration: '12-20 мин',
      participants: '15.3k',
      tags: ['Самооценка', 'Самосострадание', 'КПТ'],
      features: ['Анализ самокритики', 'Переосмысление', 'Самоподдержка'],
      path: '/self-esteem-diary'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Дневники самонаблюдения
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Структурированные инструменты для работы с эмоциями, мыслями и поведением. 
              Развивайте самосознание и улучшайте психологическое благополучие.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 border-emerald-200 bg-emerald-50">
              <BookOpen className="w-8 h-8 mx-auto text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Структурированный подход</h3>
              <p className="text-sm text-gray-600">Пошаговые формы помогают систематически анализировать ваши переживания</p>
            </Card>
            <Card className="text-center p-6 border-blue-200 bg-blue-50">
              <Lightbulb className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Персональные инсайты</h3>
              <p className="text-sm text-gray-600">Выявляйте закономерности и получайте персональные рекомендации</p>
            </Card>
            <Card className="text-center p-6 border-purple-200 bg-purple-50">
              <Users className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Проверенные методы</h3>
              <p className="text-sm text-gray-600">Основаны на научно-обоснованных подходах КПТ и mindfulness</p>
            </Card>
          </div>

          {/* Diaries Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {diaries.map((diary) => {
              const IconComponent = diary.icon;
              
              return (
                <Card 
                  key={diary.id}
                  className={`hover:shadow-lg transition-all duration-300 border-2 ${diary.borderColor} ${diary.bgColor}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${diary.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {diary.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {diary.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{diary.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{diary.participants}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-4">
                          {diary.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Возможности:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {diary.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={() => navigate(diary.path)}
                            className={`bg-gradient-to-r ${diary.color} hover:shadow-lg transition-all duration-200 text-white`}
                          >
                            Начать ведение
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">
              Начните путь к лучшему пониманию себя
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Регулярное ведение дневников поможет вам развить эмоциональный интеллект, 
              научиться управлять стрессом и улучшить качество жизни.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/self-esteem-diary')}
            >
              Попробовать дневник самооценки
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Diaries;
