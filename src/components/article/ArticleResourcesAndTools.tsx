import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Heart, Brain, Lightbulb, Target, TestTube } from 'lucide-react';

const ArticleResourcesAndTools: React.FC = () => {
  const navigate = useNavigate();

  const diagnosticTests = [
    {
      id: 1,
      title: 'Тест на депрессию PHQ-9',
      description: 'Научно валидированный скрининговый тест для оценки уровня депрессии',
      icon: TestTube,
      link: '/tests/depression-phq9'
    },
    {
      id: 2,
      title: 'Шкала депрессии Бека (BDI-II)',
      description: 'Классический инструмент для измерения тяжести депрессивной симптоматики',
      icon: BookOpen,
      link: '/tests/beck-depression'
    }
  ];

  const depressionDiaries = [
    {
      id: 1,
      title: 'Дневник работы с депрессией',
      description: 'Комплексный инструмент для ежедневного отслеживания состояния и планирования восстановления',
      icon: Heart,
      link: '/depression-care-diary'
    },
    {
      id: 2,
      title: 'Дневник мыслей',
      description: 'Структурированная работа с негативными автоматическими мыслями по методу КПТ',
      icon: Brain,
      link: '/thoughts-diary'
    },
    {
      id: 3,
      title: 'Дневник настроения',
      description: 'Для развития эмоциональной осознанности и навыков регуляции',
      icon: Heart,
      link: '/mood-diary'
    }
  ];

  const exercises = [
    {
      id: 1,
      title: 'Техники дыхания 4-7-8',
      description: 'Для снижения тревожности, стресса и улучшения эмоционального состояния',
      icon: Lightbulb
    },
    {
      id: 2,
      title: 'Сканирование тела',
      description: 'Медитативная практика для осознанности, расслабления и снижения соматических симптомов',
      icon: Target
    },
    {
      id: 3,
      title: 'Когнитивная реструктуризация',
      description: 'Техники КПТ для работы с искаженными негативными мыслями',
      icon: Brain
    },
    {
      id: 4,
      title: 'Практики самосострадания',
      description: 'Развитие доброжелательного отношения к себе и снижение самокритики',
      icon: Heart
    },
    {
      id: 5,
      title: 'Поведенческая активация',
      description: 'Планирование приятных и значимых активностей для преодоления апатии',
      icon: Target
    }
  ];

  const renderToolCard = (tool: any, buttonText: string) => (
    <Card key={tool.id} className="bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <tool.icon className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {tool.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {tool.description}
            </p>
            <div className="flex items-center justify-end">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => tool.link ? navigate(tool.link) : navigate('/practices')}
                className="hover:bg-emerald-50"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Рекомендуемые тесты, дневники и упражнения
        </h2>
        <p className="text-gray-600">
          Эти научно обоснованные инструменты помогут вам применить знания из статьи на практике, 
          оценить своё состояние и развить навыки работы с депрессией, эмоциями и мыслями.
        </p>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Диагностические тесты</TabsTrigger>
          <TabsTrigger value="diaries">Дневники</TabsTrigger>
          <TabsTrigger value="exercises">Упражнения</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="mt-6" id="tests">
          <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-emerald-600" />
                Диагностические тесты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosticTests.map((test) => renderToolCard(test, 'Пройти тест'))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diaries" className="mt-6" id="diaries">
          <Card className="bg-gradient-to-r from-pink-50 to-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                Дневники для работы с депрессией
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {depressionDiaries.map((diary) => renderToolCard(diary, 'Открыть дневник'))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-6" id="exercises">
          <Card className="bg-gradient-to-r from-purple-50 to-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                Упражнения и практики
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercises.map((exercise) => renderToolCard(exercise, 'Попробовать'))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 mr-4"
          onClick={() => navigate('/practices')}
        >
          Все упражнения и практики
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/diaries')}
        >
          Все дневники
        </Button>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 my-6">
        <h3 className="font-semibold text-emerald-900 mb-2">💡 Важно помнить</h3>
        <p className="text-emerald-800 text-sm">Если у вас есть вопросы — не стесняйтесь задавать. Если вы — психолог, используйте эти знания для поддержки клиентов и своей работы. Если вы столкнулись с депрессией сами — вы не одни, помощь возможна, и жизнь может вновь наполниться смыслом!</p>
      </div>
    </div>
  );
};

export default ArticleResourcesAndTools;
