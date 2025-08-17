
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
          <span className="bg-gradient-to-r from-psybalans-primary via-psybalans-secondary to-purple-600 bg-clip-text text-transparent">
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
          <span className="bg-gradient-to-r from-psybalans-primary via-psybalans-secondary to-purple-600 bg-clip-text text-transparent">
            поток
          </span>
          , в котором для того чтобы быть счастливыми,
          <br />
          нужно соблюдать{' '}
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-psybalans-primary bg-clip-text text-transparent">
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
          <span className="bg-gradient-to-r from-psybalans-primary via-psybalans-secondary to-purple-600 bg-clip-text text-transparent">
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
    <section className="relative particle-effects spotlight-effect bg-gradient-to-br from-background via-muted/20 to-background pt-20 pb-32">
      {/* Декоративные элементы с магическими эффектами */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse animate-float border-glow"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl animate-pulse animate-float" style={{ animationDelay: '2s' }}></div>
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
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-relaxed animate-slide-in-left"
                          style={{ animationDelay: `${index * 0.1}s` }}>
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
                      ? 'scale-110'
                      : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  style={{
                    backgroundColor: index === currentSlide 
                      ? `hsl(var(--psybalans-primary))` 
                      : index === currentSlide 
                        ? `hsl(var(--psybalans-primary))` 
                        : 'hsl(var(--muted))'
                  }}
                  aria-label={`Перейти к слайду ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Подзаголовок */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Первая платформа, которая синхронизируется с биологией вашего сознания.{' '}
              <span className="font-semibold" style={{ color: `hsl(var(--psybalans-primary))` }}>
                Не просто трекинг, а персональная экосистема баланса
              </span>{' '}
              на основе нейронауки и AI.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              className="text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, hsl(var(--psybalans-secondary)), hsl(var(--psybalans-primary)))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, hsl(var(--psybalans-primary)), hsl(var(--psybalans-secondary)))`;
              }}
              onClick={scrollToAIDiary}
            >
              Попробовать AI-дневник ✨
            </Button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow"
                  style={{
                    background: `linear-gradient(to bottom right, hsl(var(--psybalans-primary) / 0.1), hsl(var(--psybalans-secondary) / 0.1))`
                  }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: `hsl(var(--psybalans-primary))` }} />
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
