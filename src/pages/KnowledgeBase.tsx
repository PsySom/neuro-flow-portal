
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Play, Headphones, Users, Search, Filter, Clock, Star, Download, Share2, Heart, Brain, Lightbulb, Target } from 'lucide-react';

const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('articles');

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'wellbeing', name: 'Психологическое благополучие' },
    { id: 'emotions', name: 'Работа с эмоциями' },
    { id: 'thinking', name: 'Когнитивные навыки' },
    { id: 'relationships', name: 'Отношения' },
    { id: 'habits', name: 'Привычки и изменения' },
    { id: 'self-compassion', name: 'Самосострадание' }
  ];

  const colorSchemes = [
    { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-600', hover: 'hover:border-emerald-400' },
    { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-600', hover: 'hover:border-blue-400' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-600', hover: 'hover:border-purple-400' },
    { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-600', hover: 'hover:border-amber-400' },
    { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-300 dark:border-pink-600', hover: 'hover:border-pink-400' },
    { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-300 dark:border-teal-600', hover: 'hover:border-teal-400' },
    { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-300 dark:border-indigo-600', hover: 'hover:border-indigo-400' },
    { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-600', hover: 'hover:border-orange-400' },
    { bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-300 dark:border-cyan-600', hover: 'hover:border-cyan-400' },
    { bg: 'bg-lime-50 dark:bg-lime-900/20', border: 'border-lime-300 dark:border-lime-600', hover: 'hover:border-lime-400' },
    { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-600', hover: 'hover:border-red-400' },
    { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-600', hover: 'hover:border-violet-400' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Что такое психологическое здоровье: научный взгляд',
      description: 'Современные исследования о компонентах психологического благополучия и способах его поддержания.',
      category: 'wellbeing',
      readTime: '8 мин чтения',
      tags: ['Основы', 'Наука'],
      isFavorite: false,
      views: 1250
    },
    {
      id: 2,
      title: 'Нейронаука привычек: как мозг создает автоматизмы',
      description: 'Глубокое погружение в механизмы формирования привычек на уровне нейронных связей.',
      category: 'habits',
      readTime: '12 мин чтения',
      tags: ['Нейронаука', 'Привычки'],
      isFavorite: true,
      views: 890
    },
    {
      id: 3,
      title: 'Эмоциональная регуляция: от реакции к ответу',
      description: 'Практические техники управления эмоциями и развития эмоционального интеллекта.',
      category: 'emotions',
      readTime: '10 мин чтения',
      tags: ['Эмоции', 'Практика'],
      isFavorite: false,
      views: 2100
    },
    {
      id: 4,
      title: 'Когнитивные искажения: 15 ловушек мышления',
      description: 'Разбор наиболее распространенных ошибок мышления и способов их преодоления.',
      category: 'thinking',
      readTime: '15 мин чтения',
      tags: ['КПТ', 'Мышление'],
      isFavorite: false,
      views: 1680
    },
    {
      id: 5,
      title: 'Теория привязанности во взрослых отношениях',
      description: 'Как стили привязанности влияют на наши отношения и что с этим делать.',
      category: 'relationships',
      readTime: '14 мин чтения',
      tags: ['Привязанность', 'Отношения'],
      isFavorite: true,
      views: 1420
    },
    {
      id: 6,
      title: 'Самокритика vs самосострадание: что работает',
      description: 'Научные данные о влиянии самосострадания на психологическое благополучие.',
      category: 'self-compassion',
      readTime: '9 мин чтения',
      tags: ['Самосострадание', 'Исследования'],
      isFavorite: false,
      views: 950
    }
  ];

  const podcasts = [
    {
      id: 1,
      title: 'Наука о благополучии: интервью с ведущими исследователями',
      description: 'Разговор с экспертами о последних открытиях в области позитивной психологии.',
      duration: '35 мин',
      category: 'wellbeing',
      tags: ['Интервью', 'Наука'],
      downloads: 4200
    },
    {
      id: 2,
      title: 'КПТ на практике: техники для ежедневного использования',
      description: 'Практические упражнения когнитивно-поведенческой терапии для самостоятельной работы.',
      duration: '28 мин',
      category: 'thinking',
      tags: ['КПТ', 'Практика'],
      downloads: 3100
    },
    {
      id: 3,
      title: 'История изменений: преодоление тревожности',
      description: 'Реальная история человека, который справился с тревожным расстройством.',
      duration: '22 мин',
      category: 'emotions',
      tags: ['История', 'Тревога'],
      downloads: 2800
    }
  ];

  const interactiveTools = [
    {
      id: 1,
      title: 'Тест на уровень стресса (PSS-10)',
      description: 'Научно валидированная шкала для оценки воспринимаемого стресса.',
      type: 'test',
      duration: '5 мин',
      icon: Brain,
      category: 'wellbeing'
    },
    {
      id: 2,
      title: '21-дневный челлендж благодарности',
      description: 'Интерактивная программа развития практики благодарности.',
      type: 'challenge',
      duration: '21 день',
      icon: Heart,
      category: 'wellbeing'
    },
    {
      id: 3,
      title: 'Дневник мыслей (КПТ-формат)',
      description: 'Структурированный инструмент для работы с автоматическими мыслями.',
      type: 'tool',
      duration: 'Ежедневно',
      icon: Lightbulb,
      category: 'thinking'
    },
    {
      id: 4,
      title: 'SMART-планировщик целей',
      description: 'Интерактивный планировщик для постановки и достижения целей.',
      type: 'planner',
      duration: 'Разово',
      icon: Target,
      category: 'habits'
    }
  ];

  const professionalResources = [
    {
      id: 1,
      title: 'Мета-анализы эффективности подходов',
      description: 'Обзор современных исследований эффективности различных терапевтических подходов.',
      type: 'research',
      category: 'professional',
      tags: ['Мета-анализ', 'Эффективность']
    },
    {
      id: 2,
      title: 'Интеграция приложений в терапевтический процесс',
      description: 'Методические рекомендации по использованию цифровых инструментов в терапии.',
      type: 'methodology',
      category: 'professional',
      tags: ['Методика', 'Цифровые инструменты']
    },
    {
      id: 3,
      title: 'Этические аспекты использования AI в терапии',
      description: 'Обсуждение этических вопросов применения искусственного интеллекта в психологии.',
      type: 'ethics',
      category: 'professional',
      tags: ['Этика', 'AI']
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTools = interactiveTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Психологическая грамотность — основа осознанной жизни
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Тщательно отобранная коллекция современных научных данных, практических инсайтов и экспертных материалов, 
            представленных в доступной форме. Здесь вы найдете всё необходимое для самостоятельного развития, 
            повышения осознанности и поддержки работы с психологом.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Поиск материалов..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Подкасты
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Интерактив
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Для специалистов
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Card key={article.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Star className={`w-4 h-4 ${article.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <span>👁 {article.views}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          Читать
                        </Button>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Podcasts Tab */}
          <TabsContent value="podcasts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast, index) => {
                const colorScheme = colorSchemes[(index + 6) % colorSchemes.length];
                return (
                  <Card key={podcast.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Headphones className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{podcast.duration}</span>
                            <span>•</span>
                            <span>↓ {podcast.downloads}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {podcast.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {podcast.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {podcast.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="hover:bg-purple-50">
                          <Play className="w-4 h-4 mr-2" />
                          Слушать
                        </Button>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Interactive Tab */}
          <TabsContent value="interactive" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => {
                const colorScheme = colorSchemes[(index + 3) % colorSchemes.length];
                return (
                  <Card key={tool.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <tool.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-gray-500 capitalize">{tool.type}</span>
                          <div className="text-xs text-gray-400">{tool.duration}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {tool.description}
                      </p>
                      
                      <Button className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" variant="outline">
                        Начать
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionalResources.map((resource, index) => {
                const colorScheme = colorSchemes[(index + 9) % colorSchemes.length];
                return (
                  <Card key={resource.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-sm text-gray-500 capitalize">{resource.type}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                        Изучить
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Начните с любого материала — и каждый ваш шаг станет частью вашей истории перемен!
              </h2>
              <p className="text-gray-600 mb-6">
                Подпишитесь на новые материалы и подборки по темам, которые для вас актуальны
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Подписаться на обновления
                </Button>
                <Button variant="outline">
                  Предложить тему
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KnowledgeBase;
