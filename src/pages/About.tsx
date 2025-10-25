import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, Shield, Award, TrendingUp, Clock, Zap, Target, BarChart3, BookOpen, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-персонализация',
      description: 'Алгоритмы машинного обучения адаптируются под ваши циклы'
    },
    {
      icon: Shield,
      title: 'Научная основа',
      description: 'Все методики основаны на доказательной психологии'
    },
    {
      icon: Users,
      title: 'Сообщество',
      description: 'Поддержка единомышленников и специалистов'
    },
    {
      icon: Award,
      title: 'Этичность',
      description: 'Дополняем, но не заменяем профессиональную помощь'
    }
  ];

  const platformFeatures = [
    {
      icon: BookOpen,
      title: 'AI-дневник',
      description: 'Быстрая саморефлексия, выявление мыслей, эмоций, триггеров и защитных факторов',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700'
    },
    {
      icon: Activity,
      title: 'Лента времени',
      description: 'Визуализация ритмов активности, настроения, стресса, энергии и баланса потребностей',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
      icon: Brain,
      title: 'База знаний',
      description: 'Статьи, видео, подкасты с научными объяснениями и практическими рекомендациями',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700'
    },
    {
      icon: Target,
      title: 'База упражнений',
      description: 'Более 400 адаптированных техник — от дыхательных практик до когнитивных упражнений',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700'
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Персонализированные советы и планирование на основе реальных данных пользователя',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-700'
    },
    {
      icon: Zap,
      title: 'Рекомендации',
      description: 'Система умных персональных рекомендаций направленных на заботу о ваших потребностях и баланс напряжения и расслабления',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      borderColor: 'border-teal-200 dark:border-teal-700'
    }
  ];

  const cycleSteps = [
    {
      step: '1',
      title: 'Многоуровневая рефлексия',
      description: 'Краткие чек-ины и AI-дневник помогают заметить не только "что я делаю", но и "что я чувствую, чего мне не хватает"'
    },
    {
      step: '2',
      title: 'Планирование и поведенческая активация',
      description: 'На основании анализа состояния и потребностей AI предлагает персонализированные активности, микропрактики, простые шаги'
    },
    {
      step: '3',
      title: 'Реализация и отслеживание',
      description: 'Встроенный трекер и аналитика позволяют видеть взаимосвязи между поведением, эмоциями и состоянием'
    },
    {
      step: '4',
      title: 'Новый цикл — обновление рекомендаций',
      description: 'Система эволюционирует вместе с вами, предлагая новые практики и корректируя фокус'
    }
  ];

  const roadmapItems = [
    {
      period: 'Q3 2025',
      items: [
        'Расширение базы упражнений до 400+',
        'Внедрение продвинутой AI-персонализации',
        'Запуск мобильного приложения'
      ]
    },
    {
      period: 'Q4 2025',
      items: [
        'Интеграция с платформами для психологов',
        'Функционал для групповых практик и челленджей',
        'Расширенная аналитика и визуализация'
      ]
    },
    {
      period: '2026+',
      items: [
        'Платформа для совместных исследований',
        'Новые AI-ассистенты для разных групп',
        'Масштабирование партнерств с клиниками'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            О проекте{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              PsyBalans
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Первая платформа психологической самопомощи, которая синхронизируется 
            с биологией вашего сознания и строит персональную экосистему заботы
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-20">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Почему PsyBalance?
                </h2>
              </div>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  PsyBalance — это больше, чем цифровое приложение для самопомощи. Это научная лаборатория личного баланса, 
                  созданная для людей, которые устали от линейных обещаний "успеха" и хотят жить в согласии со своими 
                  внутренними ритмами, биологией и потребностями.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Мы верим: наше психическое состояние, энергия, эффективность и забота о себе — это всегда цикл, 
                  а не линия. PsyBalance — первый в мире сервис, который строит персональную экосистему заботы, 
                  учитывая биологические, эмоциональные, когнитивные и социальные циклы каждого пользователя.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Features */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift dark:bg-gray-800 dark:border-gray-700 group">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Scientific Foundation */}
        <section className="mb-20">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Научная основа и методы
                </h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                    Циклический динамический подход
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      В основе платформы — нейрофизиология циркадных и ультрадианных ритмов: мозг и тело чередуют 
                      фазы напряжения и восстановления каждые 90–120 минут и в течение суток.
                    </p>
                    <p>
                      Мы используем современные открытия в области психологии благополучия, поведенческой активации 
                      и работы с автоматическими мыслями (CBT, ACT, CFT).
                    </p>
                    <p>
                      Платформа строится на доказательных клинических рекомендациях: эффективность и безопасность 
                      методов подтверждены исследованиями и практикой специалистов.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                    AI-персонализация
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      Искусственный интеллект анализирует паттерны вашего состояния, активности, мыслей и 
                      удовлетворения потребностей.
                    </p>
                    <p>
                      Рекомендации и планирование строятся с учетом ваших индивидуальных биоритмов, хронотипа, 
                      фаз энергии, а также особенностей реагирования на стресс и привычек.
                    </p>
                    <p>
                      Каждое действие и ответ — это вклад в создание вашей уникальной карты баланса, которая 
                      постоянно обновляется и подстраивается.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Cycle */}
        <section className="mb-20">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Циклы и связь процессов
                </h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
                Основной цикл работы пользователя с приложением:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {cycleSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-emerald-50 dark:bg-gray-700/50">
                    <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
                <p className="text-gray-900 dark:text-white font-medium text-center">
                  Главная задача PsyBalance — научить использовать не "силу воли", а свои природные ритмы 
                  для мягких, но устойчивых изменений.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Platform Structure */}
        <section className="mb-20">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <Zap className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Структура платформы
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className={`p-4 border rounded-lg hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors ${feature.bgColor} ${feature.borderColor}`}>
                    <feature.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section className="mb-20">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex items-center mb-8">
                <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Роадмеп проекта
                </h2>
              </div>
              
              <div className="space-y-6">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="w-24 flex-shrink-0">
                      <div className="bg-emerald-600 dark:bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium text-center">
                        {item.period}
                      </div>
                    </div>
                    <div className="flex-1">
                      <ul className="space-y-2">
                        {item.items.map((roadmapItem, itemIndex) => (
                          <li key={itemIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                            {roadmapItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Ethics and Community */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Этичность и ответственность
                  </h3>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <p>PsyBalance не заменяет профессиональную помощь, а дополняет самостоятельную работу.</p>
                  <p>Вся информация и техники опираются на клинически обоснованные методы.</p>
                  <p>Особое внимание безопасности данных, анонимности, добровольности взаимодействий.</p>
                  <p>Прозрачные рекомендации обратиться за профессиональной помощью при тяжёлых состояниях.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Сообщество и открытость
                  </h3>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <p>Основные функции доступны без регистрации — изучайте и делитесь практиками.</p>
                  <p>Психологи могут использовать платформу для поддержки клиентов между сессиями.</p>
                  <p>Сообщество пользователей делится опытом в рамках этичных коммуникаций.</p>
                  <p>Платформа растёт вместе с пользователями через обратную связь.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="hover-lift dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Готовы начать свой путь к балансу?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                PsyBalance создан для тех, кто ценит осознанность, науку и индивидуальный путь. 
                Здесь вы не одиноки: поддержка единомышленников, опыт экспертов и современные технологии.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
                  <Link to="/register">Попробовать бесплатно</Link>
                </Button>
                <Button asChild variant="outline" className="border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  <Link to="/for-professionals">Для специалистов</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
