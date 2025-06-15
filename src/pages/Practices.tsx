
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  TrendingUp,
  ChevronDown,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Practices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTherapyMethods, setSelectedTherapyMethods] = useState<string[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const { toast } = useToast();

  // Типы контента
  const contentTypes = [
    { id: 'all', label: 'Все типы' },
    { id: 'exercises', label: 'Упражнения' },
    { id: 'practices', label: 'Практики' },
    { id: 'tests', label: 'Тесты' }
  ];

  // Методы терапии
  const therapyMethods = [
    { id: 'cbt', label: 'КПТ (Когнитивно-поведенческая терапия)' },
    { id: 'act', label: 'ACT (Терапия принятия и ответственности)' },
    { id: 'dbt', label: 'DBT (Диалектическая поведенческая терапия)' },
    { id: 'mindfulness', label: 'Mindfulness (Осознанность)' },
    { id: 'compassion', label: 'Терапия сострадания' },
    { id: 'gestalt', label: 'Гештальт-терапия' },
    { id: 'psychodynamic', label: 'Психодинамическая терапия' },
    { id: 'humanistic', label: 'Гуманистическая терапия' }
  ];

  // Проблемы
  const problems = [
    { id: 'anxiety', label: 'Тревога и беспокойство' },
    { id: 'depression', label: 'Депрессия и подавленность' },
    { id: 'stress', label: 'Стресс и выгорание' },
    { id: 'self-criticism', label: 'Самокритика и низкая самооценка' },
    { id: 'motivation', label: 'Прокрастинация и мотивация' },
    { id: 'relationships', label: 'Отношения' },
    { id: 'trauma', label: 'Травма и ПТСР' },
    { id: 'sleep', label: 'Проблемы со сном' },
    { id: 'anger', label: 'Гнев и агрессия' },
    { id: 'addiction', label: 'Зависимости' }
  ];

  // Объекты воздействия
  const objects = [
    { id: 'thoughts', label: 'Мысли' },
    { id: 'self-esteem', label: 'Самооценка' },
    { id: 'self-criticism', label: 'Самокритика' },
    { id: 'emotions', label: 'Эмоции и чувства' },
    { id: 'states', label: 'Состояния' },
    { id: 'behavior', label: 'Поведение' },
    { id: 'diagnostic-tests', label: 'Диагностические тесты' },
    { id: 'typological-tests', label: 'Типологические тесты' }
  ];

  // Категории практик
  const practiceCategories = [
    { id: 'all', label: 'Все категории' },
    { id: 'clinical', label: 'Клинические (научно обоснованные)' },
    { id: 'therapeutic', label: 'Терапевтические' },
    { id: 'other', label: 'Другие' }
  ];

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

  const handleMultiSelectChange = (value: string, selectedArray: string[], setFunction: (arr: string[]) => void) => {
    if (selectedArray.includes(value)) {
      setFunction(selectedArray.filter(item => item !== value));
    } else {
      setFunction([...selectedArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedTherapyMethods([]);
    setSelectedProblems([]);
    setSelectedObjects([]);
    setSelectedDuration('all');
    setSelectedLevel('all');
    setSelectedCategory('all');
  };

  // Расширенные данные с мета-тегами
  const allContent = [
    {
      id: 1,
      title: 'Дыхание 4-7-8',
      description: 'Техника для быстрого снижения тревожности и засыпания',
      type: 'exercises',
      duration: '5 мин',
      level: 'Легко',
      participants: '12.5k',
      category: 'clinical',
      therapyMethods: ['cbt', 'mindfulness'],
      problems: ['anxiety', 'sleep', 'stress'],
      objects: ['states', 'emotions'],
      tags: ['Дыхание', 'Тревога', 'Релаксация'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      title: 'Сканирование тела',
      description: 'Практика осознанности для расслабления и снятия напряжения',
      type: 'practices',
      duration: '15 мин',
      level: 'Средне',
      participants: '8.3k',
      category: 'clinical',
      therapyMethods: ['mindfulness', 'gestalt'],
      problems: ['stress', 'anxiety'],
      objects: ['states', 'emotions'],
      tags: ['Медитация', 'Расслабление', 'Осознанность'],
      color: 'from-green-400 to-emerald-600'
    },
    {
      id: 3,
      title: 'Колесо эмоций',
      description: 'Интерактивный тест для определения и осознания текущих эмоций',
      type: 'tests',
      duration: '3 мин',
      level: 'Легко',
      participants: '15.7k',
      category: 'diagnostic-tests',
      therapyMethods: ['cbt', 'dbt'],
      problems: ['emotions'],
      objects: ['emotions', 'diagnostic-tests'],
      tags: ['Эмоции', 'Тест', 'Диагностика'],
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      title: 'Шкала самосострадания',
      description: 'Оценка уровня самосострадания и доброты к себе',
      type: 'tests',
      duration: '10 мин',
      level: 'Средне',
      participants: '9.2k',
      category: 'diagnostic-tests',
      therapyMethods: ['compassion', 'act'],
      problems: ['self-criticism', 'depression'],
      objects: ['self-esteem', 'self-criticism', 'diagnostic-tests'],
      tags: ['Самосострадание', 'Самооценка', 'Тест'],
      color: 'from-pink-400 to-rose-600'
    },
    {
      id: 5,
      title: 'Техника STOP',
      description: 'Быстрая техника остановки негативных мыслительных циклов',
      type: 'exercises',
      duration: '2 мин',
      level: 'Легко',
      participants: '18.1k',
      category: 'clinical',
      therapyMethods: ['cbt', 'mindfulness'],
      problems: ['anxiety', 'stress', 'anger'],
      objects: ['thoughts', 'emotions'],
      tags: ['КПТ', 'Мысли', 'Стоп-техника'],
      color: 'from-red-400 to-orange-500'
    },
    {
      id: 6,
      title: 'Большая Пятерка личности',
      description: 'Научно обоснованный тест личностных черт',
      type: 'tests',
      duration: '15 мин',
      level: 'Средне',
      participants: '25.3k',
      category: 'typological-tests',
      therapyMethods: ['psychodynamic', 'humanistic'],
      problems: [],
      objects: ['typological-tests'],
      tags: ['Личность', 'Типология', 'Тест'],
      color: 'from-indigo-400 to-purple-600'
    }
  ];

  // Фильтрация контента
  const filteredContent = allContent.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    const matchesTherapyMethods = selectedTherapyMethods.length === 0 || 
      item.therapyMethods.some(method => selectedTherapyMethods.includes(method));
    
    const matchesProblems = selectedProblems.length === 0 || 
      item.problems.some(problem => selectedProblems.includes(problem));
    
    const matchesObjects = selectedObjects.length === 0 || 
      item.objects.some(object => selectedObjects.includes(object));
    
    const matchesDuration = selectedDuration === 'all' || 
      (selectedDuration === '2-5' && parseInt(item.duration) <= 5) ||
      (selectedDuration === '10-20' && parseInt(item.duration) >= 10 && parseInt(item.duration) <= 20) ||
      (selectedDuration === '30+' && parseInt(item.duration) >= 30);
    
    const matchesLevel = selectedLevel === 'all' || 
      (selectedLevel === 'easy' && item.level === 'Легко') ||
      (selectedLevel === 'medium' && item.level === 'Средне') ||
      (selectedLevel === 'advanced' && item.level === 'Продвинутый');
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesType && matchesTherapyMethods && 
           matchesProblems && matchesObjects && matchesDuration && 
           matchesLevel && matchesCategory;
  });

  const activeFiltersCount = [
    selectedType !== 'all' ? 1 : 0,
    selectedTherapyMethods.length,
    selectedProblems.length,
    selectedObjects.length,
    selectedDuration !== 'all' ? 1 : 0,
    selectedLevel !== 'all' ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Умный поиск</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} фильтр{activeFiltersCount > 1 ? 'ов' : ''}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Очистить все
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Расширенные фильтры
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isFiltersExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Основная строка поиска */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск по проблеме, названию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <Target className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Тип контента" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
            </div>

            {/* Расширенные фильтры */}
            <Collapsible open={isFiltersExpanded} onOpenChange={setIsFiltersExpanded}>
              <CollapsibleContent className="space-y-6 pt-4 border-t">
                {/* Методы терапии */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Методы терапии
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {therapyMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={method.id}
                          checked={selectedTherapyMethods.includes(method.id)}
                          onCheckedChange={() => handleMultiSelectChange(method.id, selectedTherapyMethods, setSelectedTherapyMethods)}
                        />
                        <label htmlFor={method.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {method.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Проблемы */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Проблемы и запросы
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {problems.map((problem) => (
                      <div key={problem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={problem.id}
                          checked={selectedProblems.includes(problem.id)}
                          onCheckedChange={() => handleMultiSelectChange(problem.id, selectedProblems, setSelectedProblems)}
                        />
                        <label htmlFor={problem.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {problem.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Объекты воздействия */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Объект воздействия
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {objects.map((object) => (
                      <div key={object.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={object.id}
                          checked={selectedObjects.includes(object.id)}
                          onCheckedChange={() => handleMultiSelectChange(object.id, selectedObjects, setSelectedObjects)}
                        />
                        <label htmlFor={object.id} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                          {object.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Категории */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Категория практик
                  </h4>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-1/3">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Результаты поиска */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Найдено: {filteredContent.length} {filteredContent.length === 1 ? 'результат' : filteredContent.length < 5 ? 'результата' : 'результатов'}
            </h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">По релевантности</SelectItem>
                  <SelectItem value="popular">По популярности</SelectItem>
                  <SelectItem value="duration">По времени</SelectItem>
                  <SelectItem value="level">По сложности</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Карточки контента */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{item.participants}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {contentTypes.find(t => t.id === item.type)?.label}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button className={`bg-gradient-to-r ${item.color} hover:shadow-lg transition-all duration-200`}>
                        Попробовать сейчас
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(item.title)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Поделиться
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ничего не найдено</h3>
                <p className="text-sm">
                  Попробуйте изменить параметры поиска или очистить фильтры
                </p>
              </div>
              <Button onClick={clearAllFilters} variant="outline">
                Очистить все фильтры
              </Button>
            </CardContent>
          </Card>
        )}

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
