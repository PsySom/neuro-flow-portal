import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Timer, 
  Target, 
  Filter, 
  Search, 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Star,
  Users,
  Share2,
  BookOpen,
  ChevronRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Practices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { toast } = useToast();

  const handleShare = (title: string, type: string = 'практику') => {
    if (navigator.share) {
      navigator.share({
        title: `${title} - PsyBalans`,
        text: `Попробуйте эту ${type}: ${title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Ссылка скопирована",
        description: `Ссылка на ${type} "${title}" скопирована в буфер обмена`,
      });
    }
  };

  const practiceCategories = [
    {
      id: 'anxiety',
      title: 'Тревога и беспокойство',
      icon: Shield,
      count: '80+',
      color: 'from-blue-400 to-blue-600',
      description: 'Техники для снижения тревоги и успокоения',
      practices: [
        { name: 'Дыхание 4-7-8', duration: '5 мин', level: 'Легко' },
        { name: 'Техника заземления 5-4-3-2-1', duration: '3 мин', level: 'Легко' },
        { name: 'Прогрессивное расслабление', duration: '15 мин', level: 'Средне' },
        { name: 'Медитация любящей доброты', duration: '20 мин', level: 'Средне' }
      ]
    },
    {
      id: 'depression',
      title: 'Депрессия и подавленность',
      icon: Heart,
      count: '70+',
      color: 'from-purple-400 to-purple-600',
      description: 'Активационные и когнитивные техники',
      practices: [
        { name: 'Планирование приятных активностей', duration: '10 мин', level: 'Легко' },
        { name: 'Дневник достижений', duration: '15 мин', level: 'Легко' },
        { name: 'Работа с депрессивной триадой', duration: '25 мин', level: 'Продвинутый' },
        { name: 'Дневник благодарности', duration: '5 мин', level: 'Легко' }
      ]
    },
    {
      id: 'self-criticism',
      title: 'Самокритика и низкая самооценка',
      icon: Star,
      count: '60+',
      color: 'from-green-400 to-emerald-600',
      description: 'Практики самосострадания и принятия',
      practices: [
        { name: 'Тест на самосострадание', duration: '10 мин', level: 'Легко' },
        { name: 'Письмо от заботливого друга', duration: '20 мин', level: 'Средне' },
        { name: 'Дневник сильных сторон', duration: '15 мин', level: 'Легко' },
        { name: 'Медитация любящей доброты к себе', duration: '18 мин', level: 'Средне' }
      ]
    },
    {
      id: 'stress',
      title: 'Стресс и выгорание',
      icon: Zap,
      count: '90+',
      color: 'from-orange-400 to-red-500',
      description: 'Техники восстановления и профилактики',
      practices: [
        { name: 'Коробочное дыхание', duration: '3 мин', level: 'Легко' },
        { name: 'Техника STOP', duration: '2 мин', level: 'Легко' },
        { name: 'Энергетический аудит', duration: '30 мин', level: 'Средне' },
        { name: 'План стресс-менеджмента', duration: '45 мин', level: 'Продвинутый' }
      ]
    },
    {
      id: 'motivation',
      title: 'Прокрастинация и мотивация',
      icon: Target,
      count: '50+',
      color: 'from-indigo-400 to-purple-600',
      description: 'Преодоление откладывания и повышение мотивации',
      practices: [
        { name: 'Правило 2 минут', duration: '2 мин', level: 'Легко' },
        { name: 'Техника Pomodoro', duration: '25 мин', level: 'Средне' },
        { name: 'Связь с ценностями', duration: '20 мин', level: 'Средне' },
        { name: 'Визуализация "Будущее Я"', duration: '15 мин', level: 'Средне' }
      ]
    }
  ];

  const therapeuticApproaches = [
    {
      id: 'cbt',
      title: 'Когнитивно-поведенческие техники',
      count: '120+',
      description: 'Работа с мыслями и поведением',
      icon: Brain
    },
    {
      id: 'act',
      title: 'ACT-практики',
      count: '80+',
      description: 'Принятие и ценностно-ориентированные действия',
      icon: Target
    },
    {
      id: 'compassion',
      title: 'Практики самосострадания',
      count: '60+',
      description: 'Развитие доброты к себе',
      icon: Heart
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness-практики',
      count: '100+',
      description: 'Медитации и осознанность',
      icon: Users
    }
  ];

  const assessmentTools = [
    {
      category: 'Базовое состояние',
      tests: [
        'Шкала воспринимаемого стресса (PSS-10)',
        'Шкала тревоги и депрессии (HADS)',
        'Шкала удовлетворенности жизнью (SWLS)',
        'Тест на эмоциональный интеллект'
      ]
    },
    {
      category: 'Специализированные тесты',
      tests: [
        'Тест на самосострадание (SCS)',
        'Шкала психологической гибкости (AAQ-II)',
        'Тест на стиль привязанности',
        'Опросник выгорания (MBI)'
      ]
    },
    {
      category: 'Личностные особенности',
      tests: [
        'Большая Пятерка (краткая версия)',
        'VIA-тест сильных сторон характера',
        'Тест на хронотип',
        'Опросник жизнестойкости'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок и введение */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            400+ научно обоснованных практик для любой ситуации
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Знания без практики остаются теорией. Наша библиотека содержит тщательно отобранные и адаптированные 
            упражнения из различных терапевтических традиций. Каждая практика снабжена научным обоснованием, 
            пошаговыми инструкциями и рекомендациями по применению.
          </p>
        </div>

        {/* Умный поиск и фильтры */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Умный поиск</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по проблеме..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <Timer className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Время выполнения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любое время</SelectItem>
                  <SelectItem value="2-5">2-5 минут</SelectItem>
                  <SelectItem value="10-20">10-20 минут</SelectItem>
                  <SelectItem value="30+">30+ минут</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Уровень сложности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любой уровень</SelectItem>
                  <SelectItem value="easy">Начинающий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="advanced">Продвинутый</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Больше фильтров
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="problems" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="problems">Практики по проблемам</TabsTrigger>
            <TabsTrigger value="methods">Практики по методам</TabsTrigger>
            <TabsTrigger value="tests">Тесты и самооценки</TabsTrigger>
          </TabsList>

          {/* Практики по проблемам */}
          <TabsContent value="problems" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {practiceCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {category.count} практик
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShare(category.title, 'категорию практик')}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {category.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">
                        {category.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {category.practices.map((practice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {practice.name}
                            </h4>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {practice.duration}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {practice.level}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button size="sm">
                              <Play className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleShare(practice.name, 'практику')}
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button className="w-full mt-4" variant="outline">
                        Смотреть все {category.count} практик
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Практики по методам */}
          <TabsContent value="methods" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapeuticApproaches.map((approach) => {
                const IconComponent = approach.icon;
                return (
                  <Card key={approach.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {approach.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {approach.description}
                          </p>
                          <Badge variant="secondary">{approach.count} упражнений</Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          Изучить методы
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleShare(approach.title, 'методы')}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Тесты и самооценки */}
          <TabsContent value="tests" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {assessmentTools.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                        {tool.category}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(tool.category, 'тесты')}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tool.tests.map((test, testIndex) => (
                      <div key={testIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {test}
                        </span>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button size="sm" variant="outline">
                            Пройти
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleShare(test, 'тест')}
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Интерактивные оценки */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Интерактивные оценки
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Ежедневные чек-ины
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare('Ежедневные чек-ины', 'интерактивную оценку')}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <li>• Быстрая оценка настроения и энергии</li>
                      <li>• Мини-тест на уровень стресса</li>
                      <li>• Оценка качества сна</li>
                      <li>• Проверка базовых потребностей</li>
                    </ul>
                    <Button className="w-full">Начать чек-ин</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Еженедельные обзоры
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare('Еженедельные обзоры', 'интерактивную оценку')}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <li>• Анализ динамики за неделю</li>
                      <li>• Оценка прогресса по целям</li>
                      <li>• Рефлексия о изменениях</li>
                      <li>• Планирование следующей недели</li>
                    </ul>
                    <Button className="w-full">Создать обзор</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA секция */}
        <Card className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Готовы начать свой путь к балансу?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Создайте персональную библиотеку практик, отслеживайте прогресс и получайте 
              рекомендации на основе ваших уникальных потребностей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Создать аккаунт
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Узнать больше
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Practices;

</edits_to_apply>
