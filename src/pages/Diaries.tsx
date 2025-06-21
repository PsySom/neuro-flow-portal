
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Calendar, 
  Search, 
  BookOpen,
  Heart,
  Activity,
  Clock,
  Zap,
  Shield,
  Moon,
  Target,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/dashboard/UserMenu';
import { Input } from '@/components/ui/input';

const Diaries = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const diaryCategories = [
    {
      id: 'emotional',
      title: 'Эмоциональное благополучие',
      diaries: [
        {
          id: 'ai-diary',
          title: 'AI дневник',
          description: 'Интеллектуальный помощник для анализа ваших записей и предоставления персональных инсайтов',
          icon: Brain,
          color: 'bg-purple-500'
        },
        {
          id: 'mood-diary',
          title: 'Дневник настроения и эмоций',
          description: 'Отслеживание эмоциональных состояний, триггеров и паттернов настроения',
          icon: Heart,
          color: 'bg-pink-500'
        },
        {
          id: 'activities-diary',
          title: 'Дневник активностей и удовлетворения потребностей',
          description: 'Фиксация ежедневных активностей и их влияния на удовлетворение базовых потребностей',
          icon: Activity,
          color: 'bg-emerald-500'
        }
      ]
    },
    {
      id: 'cognitive',
      title: 'Когнитивное здоровье',
      diaries: [
        {
          id: 'procrastination-diary',
          title: 'Дневник прокрастинации и избегания',
          description: 'Анализ паттернов откладывания дел и стратегии преодоления избегающего поведения',
          icon: Clock,
          color: 'bg-orange-500'
        },
        {
          id: 'thoughts-diary',
          title: 'Дневник работы с мыслями и когнитивными искажениями',
          description: 'Выявление и переосмысление деструктивных мыслительных паттернов',
          icon: Zap,
          color: 'bg-blue-500'
        },
        {
          id: 'self-esteem-diary',
          title: 'Дневник самооценки и самоподдержки',
          description: 'Развитие позитивного отношения к себе и практики самосострадания',
          icon: Shield,
          color: 'bg-indigo-500'
        }
      ]
    },
    {
      id: 'behavioral',
      title: 'Поведенческие паттерны',
      diaries: [
        {
          id: 'sleep-diary',
          title: 'Дневник сна',
          description: 'Мониторинг качества сна, режима и факторов, влияющих на отдых',
          icon: Moon,
          color: 'bg-slate-500'
        },
        {
          id: 'habits-diary',
          title: 'Дневник привычек',
          description: 'Отслеживание формирования полезных привычек и избавления от вредных',
          icon: Target,
          color: 'bg-green-500'
        },
        {
          id: 'addictions-diary',
          title: 'Дневник аддикций',
          description: 'Работа с зависимостями и компульсивным поведением',
          icon: AlertTriangle,
          color: 'bg-red-500'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8" style={{ color: `hsl(var(--psybalans-primary))` }} />
              <span 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))` 
                }}
              >
                PsyBalans
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard">
                <Button variant="ghost" className="dark:text-gray-300">
                  <Activity className="w-4 h-4 mr-2" />
                  Дашборд
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="font-medium"
                style={{ color: `hsl(var(--psybalans-primary))` }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Дневники
              </Button>
              <Link to="/calendar">
                <Button variant="ghost" className="dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Календарь
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="dark:text-gray-300"
                onClick={() => navigate('/practices')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Упражнения
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Поиск по дневникам..." 
                  className="pl-10 w-64 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Дневники психологического здоровья
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Выберите дневник для работы с конкретными аспектами вашего благополучия
          </p>
        </div>

        {/* Diary Categories */}
        <div className="space-y-12">
          {diaryCategories.map((category) => (
            <div key={category.id} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.diaries.map((diary) => {
                  const IconComponent = diary.icon;
                  return (
                    <Card 
                      key={diary.id} 
                      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg ${diary.color} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {diary.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {diary.description}
                        </CardDescription>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                          >
                            Открыть дневник
                          </Button>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>В разработке</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Быстрые действия
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-2"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Создать запись</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-2"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm">Поиск записей</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-16 flex flex-col items-center justify-center space-y-2"
            >
              <Activity className="w-5 h-5" />
              <span className="text-sm">Статистика</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diaries;
