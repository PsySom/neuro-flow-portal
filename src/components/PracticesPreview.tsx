
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Timer, Users, ArrowRight, Share2 } from 'lucide-react';

const PracticesPreview = () => {
  const [activeExercise, setActiveExercise] = useState(null);

  const exercises = [
    {
      id: 1,
      title: 'Дыхание 4-7-8',
      description: 'Техника для быстрого снижения тревожности и засыпания',
      duration: '5 мин',
      difficulty: 'Легко',
      participants: '12.5k',
      tags: ['Дыхание', 'Тревога'],
      color: 'from-blue-400 to-blue-600',
      steps: [
        'Примите удобное положение',
        'Вдох через нос на 4 счета',
        'Задержка дыхания на 7 счетов',
        'Выдох через рот на 8 счетов'
      ]
    },
    {
      id: 2,
      title: 'Сканирование тела',
      description: 'Практика осознанности для расслабления и снятия напряжения',
      duration: '15 мин',
      difficulty: 'Средне',
      participants: '8.3k',
      tags: ['Медитация', 'Расслабление'],
      color: 'from-green-400 to-emerald-600',
      steps: [
        'Лягте на спину и закройте глаза',
        'Начните с пальцев ног',
        'Постепенно сканируйте все тело',
        'Отмечайте ощущения без суждений'
      ]
    },
    {
      id: 3,
      title: 'Колесо эмоций',
      description: 'Интерактивный тест для определения и осознания текущих эмоций',
      duration: '3 мин',
      difficulty: 'Легко',
      participants: '15.7k',
      tags: ['Эмоции', 'Тест'],
      color: 'from-purple-400 to-purple-600',
      steps: [
        'Посмотрите на текущий момент',
        'Выберите базовую эмоцию',
        'Уточните её оттенок',
        'Получите персональные рекомендации'
      ]
    }
  ];

  const startExercise = (exerciseId) => {
    setActiveExercise(exerciseId);
    // Здесь была бы логика запуска упражнения
  };

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Упражнения и практики
        </h2>
        <p className="text-lg text-gray-600">
          Попробуйте и поделитесь результатами без регистрации
        </p>
      </div>

      <div className="space-y-6">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50"
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${exercise.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Play className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {exercise.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {exercise.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Timer className="w-4 h-4" />
                      <span>{exercise.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{exercise.participants}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    {exercise.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {activeExercise === exercise.id ? (
                    <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 animate-scale-in">
                      <h4 className="font-semibold text-gray-800 mb-3">Пошаговая инструкция:</h4>
                      <ol className="space-y-2 mb-4">
                        {exercise.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                          Начать практику
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setActiveExercise(null)}>
                          Свернуть
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Button 
                        onClick={() => startExercise(exercise.id)}
                        className={`bg-gradient-to-r ${exercise.color} hover:shadow-lg transition-all duration-200`}
                      >
                        Попробовать сейчас
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Поделиться
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="text-center pt-4">
          <Button variant="outline" className="hover:bg-emerald-50 hover:border-emerald-300">
            Открыть всю базу упражнений
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PracticesPreview;
