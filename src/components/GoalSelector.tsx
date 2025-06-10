
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Moon, Zap, Heart, Shield } from 'lucide-react';

const GoalSelector = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = [
    {
      id: 'anxiety',
      title: 'Тревога',
      icon: Shield,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200 hover:border-purple-300',
      description: 'Техники управления тревожностью и стрессом',
      exercises: ['Дыхательные практики', '5-4-3-2-1 техника', 'Прогрессивная релаксация']
    },
    {
      id: 'procrastination',
      title: 'Прокрастинация',
      icon: Clock,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200 hover:border-orange-300',
      description: 'Преодоление откладывания дел',
      exercises: ['Техника Помодоро', 'Разбивка задач', 'Мотивационные техники']
    },
    {
      id: 'sleep',
      title: 'Сон',
      icon: Moon,
      color: 'from-indigo-400 to-purple-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
      borderColor: 'border-indigo-200 hover:border-indigo-300',
      description: 'Улучшение качества сна и режима',
      exercises: ['Гигиена сна', 'Медитации перед сном', 'Дневник сна']
    },
    {
      id: 'energy',
      title: 'Энергия',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      borderColor: 'border-yellow-200 hover:border-yellow-300',
      description: 'Повышение энергии и жизненных сил',
      exercises: ['Энергетические практики', 'Планирование отдыха', 'Работа с привычками']
    },
    {
      id: 'mood',
      title: 'Настроение',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      borderColor: 'border-pink-200 hover:border-pink-300',
      description: 'Стабилизация эмоционального состояния',
      exercises: ['Дневник благодарности', 'Эмоциональная регуляция', 'Позитивные практики']
    },
    {
      id: 'stress',
      title: 'Стресс',
      icon: Brain,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      description: 'Управление стрессом и напряжением',
      exercises: ['Mindfulness', 'Телесные практики', 'Когнитивная перестройка']
    }
  ];

  return (
    <section className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Что вы хотите улучшить сегодня?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Выберите область для работы и получите персональные упражнения прямо сейчас
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
              selectedGoal === goal.id 
                ? `${goal.borderColor.replace('hover:', '')} shadow-lg` 
                : `${goal.borderColor} shadow-md`
            } ${goal.bgColor}`}
            onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center`}>
                  <goal.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>

              {selectedGoal === goal.id && (
                <div className="animate-fade-in space-y-3 border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Доступные упражнения:</h4>
                  {goal.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="text-sm font-medium text-gray-700">{exercise}</span>
                      <Badge variant="secondary" className="text-xs">
                        Попробовать
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button className={`w-full py-2 px-4 bg-gradient-to-r ${goal.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200`}>
                      Начать сейчас
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 mb-4">
          💡 Упражнения можно сохранить после входа в систему
        </p>
      </div>
    </section>
  );
};

export default GoalSelector;
