
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Clock, 
  Brain, 
  Shield, 
  Moon, 
  Target, 
  Zap,
  Bot
} from 'lucide-react';

const Diaries = () => {
  const navigate = useNavigate();

  const diaryCategories = [
    {
      title: "Эмоциональное благополучие",
      color: "bg-pink-50 border-pink-200",
      diaries: [
        {
          id: "ai-diary",
          title: "AI дневник",
          description: "Интеллектуальный помощник для анализа ваших записей и персональных рекомендаций",
          icon: Bot,
          iconColor: "text-purple-600",
          route: "/diaries/ai"
        },
        {
          id: "mood-emotions",
          title: "Дневник настроения и эмоций",
          description: "Отслеживание настроения, эмоций и их влияния на повседневную жизнь",
          icon: Heart,
          iconColor: "text-pink-600",
          route: "/diaries/mood"
        },
        {
          id: "activities-needs",
          title: "Дневник активностей и удовлетворения потребностей",
          description: "Мониторинг деятельности и анализ удовлетворения базовых потребностей",
          icon: Activity,
          iconColor: "text-green-600",
          route: "/diaries/activities"
        }
      ]
    },
    {
      title: "Когнитивное здоровье",
      color: "bg-blue-50 border-blue-200",
      diaries: [
        {
          id: "procrastination",
          title: "Дневник прокрастинации и избегания",
          description: "Работа с откладыванием дел и паттернами избегающего поведения",
          icon: Clock,
          iconColor: "text-orange-600",
          route: "/diaries/procrastination"
        },
        {
          id: "thoughts-cognitive",
          title: "Дневник работы с мыслями и когнитивными искажениями",
          description: "Анализ мыслительных паттернов и работа с негативными убеждениями",
          icon: Brain,
          iconColor: "text-indigo-600",
          route: "/diaries/thoughts"
        },
        {
          id: "self-esteem",
          title: "Дневник самооценки и самоподдержки",
          description: "Развитие здоровой самооценки и навыков самосострадания",
          icon: Shield,
          iconColor: "text-emerald-600",
          route: "/diaries/self-esteem"
        }
      ]
    },
    {
      title: "Поведенческие паттерны",
      color: "bg-amber-50 border-amber-200",
      diaries: [
        {
          id: "sleep",
          title: "Дневник сна",
          description: "Мониторинг качества сна и факторов, влияющих на отдых",
          icon: Moon,
          iconColor: "text-blue-700",
          route: "/diaries/sleep"
        },
        {
          id: "habits",
          title: "Дневник привычек",
          description: "Отслеживание формирования новых привычек и избавления от вредных",
          icon: Target,
          iconColor: "text-red-600",
          route: "/diaries/habits"
        },
        {
          id: "addictions",
          title: "Дневник аддикций",
          description: "Работа с зависимостями и компульсивным поведением",
          icon: Zap,
          iconColor: "text-yellow-600",
          route: "/diaries/addictions"
        }
      ]
    }
  ];

  const handleDiaryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2"
          >
            <span>Дашборд</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/calendar')}
            className="flex items-center space-x-2"
          >
            <span>Календарь</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/practices')}
            className="flex items-center space-x-2"
          >
            <span>Упражнения</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Дневники самопознания
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Выберите подходящий дневник для глубокого анализа различных аспектов вашего психологического состояния и личностного развития
          </p>
        </div>

        {/* Diary Categories */}
        <div className="space-y-12">
          {diaryCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.diaries.map((diary) => {
                  const IconComponent = diary.icon;
                  return (
                    <Card 
                      key={diary.id} 
                      className={`${category.color} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                      onClick={() => handleDiaryClick(diary.route)}
                    >
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-white rounded-full shadow-md">
                            <IconComponent className={`w-8 h-8 ${diary.iconColor}`} />
                          </div>
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {diary.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center text-gray-600 leading-relaxed">
                          {diary.description}
                        </CardDescription>
                        <div className="mt-6 flex justify-center">
                          <Button 
                            variant="default" 
                            size="sm"
                            className="w-full"
                          >
                            Открыть дневник
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diaries;
