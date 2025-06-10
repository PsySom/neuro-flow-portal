
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Zap, Target } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { number: '400+', label: 'упражнений', icon: Target },
    { number: '7', label: 'научных подходов', icon: Brain },
    { number: '10k+', label: 'пользователей', icon: Users },
    { number: 'AI', label: 'персонализация', icon: Zap },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 pt-20 pb-32">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Бейдж */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm">
              🧠 Научно обоснованный подход к психологическому балансу
            </Badge>
          </div>

          {/* Заголовок-провокация */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Ваш мозг работает{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
                циклами
              </span>
              .
              <br />
              Ваши приложения — линейно.
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl text-gray-600">
                В этом проблема.
              </span>
            </h1>
          </div>

          {/* Подзаголовок */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Первая платформа, которая синхронизируется с биологией вашего сознания.{' '}
              <span className="text-emerald-600 font-semibold">
                Не просто трекинг, а персональная экосистема баланса
              </span>{' '}
              на основе нейронауки и AI.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Попробовать AI-дневник ✨
            </Button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
