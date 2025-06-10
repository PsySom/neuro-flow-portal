
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Users, Shield, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            О проекте PsyBalans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Первая платформа психологической самопомощи, которая синхронизируется 
            с биологией вашего сознания
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <Brain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI-персонализация</h3>
              <p className="text-sm text-gray-600">
                Алгоритмы машинного обучения адаптируются под ваши циклы
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Научная основа</h3>
              <p className="text-sm text-gray-600">
                Все методики основаны на доказательной психологии
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Сообщество</h3>
              <p className="text-sm text-gray-600">
                Поддержка единомышленников и специалистов
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Этичность</h3>
              <p className="text-sm text-gray-600">
                Дополняем, но не заменяем профессиональную помощь
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Подробная информация о проекте в разработке
          </h2>
          <p className="text-gray-600">
            Здесь будет детальное описание научной методологии, команды и партнёров
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
