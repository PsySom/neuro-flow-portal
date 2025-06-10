
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: (
        <>
          Ваш мозг работает{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
            циклами
          </span>
          .
          <br />
          Ваши приложения — линейно.
          <br />
          <span className="text-lg md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mt-4 block">
            В этом проблема.
          </span>
        </>
      )
    },
    {
      title: (
        <>
          Жизнь — это{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
            поток
          </span>
          , в котором для того чтобы быть счастливыми,
          <br />
          нужно соблюдать{' '}
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
            баланс
          </span>{' '}
          и заботиться о себе и своих потребностях.
        </>
      )
    },
    {
      title: (
        <>
          Настоящие перемены начинаются с понимания своих{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
            ритмов
          </span>
          , состояний и потребностей.
          <br />
          <span className="text-lg md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 mt-6 block">
            PsyBalans — первая платформа, которая помогает вам строить жизнь вокруг себя, а не под чужой шаблон.
          </span>
        </>
      )
    }
  ];

  const stats = [
    { number: '400+', label: 'упражнений', icon: Target },
    { number: '7', label: 'научных подходов', icon: Brain },
    { number: '10k+', label: 'пользователей', icon: Users },
    { number: 'AI', label: 'персонализация', icon: Zap },
  ];

  const scrollToAIDiary = () => {
    const element = document.getElementById('ai-diary');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Auto-advance slides (slower - every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-32">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/40 to-pink-200/40 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Бейдж */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 px-4 py-2 text-sm">
              🧠 Научно обоснованный подход к психологическому балансу
            </Badge>
          </div>

          {/* Слайдер заголовков */}
          <div className="relative space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative h-[280px] md:h-[320px] lg:h-[360px] flex items-center justify-center px-4">
              <div className="relative w-full max-w-5xl">
                {/* Slides */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slides.map((slide, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-8 md:px-12 lg:px-16"
                      >
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-relaxed">
                          {slide.title}
                        </h1>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-emerald-500 dark:bg-emerald-400 scale-110'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Подзаголовок */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Первая платформа, которая синхронизируется с биологией вашего сознания.{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Не просто трекинг, а персональная экосистема баланса
              </span>{' '}
              на основе нейронауки и AI.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={scrollToAIDiary}
            >
              Попробовать AI-дневник ✨
            </Button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                  <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
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
