import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, BarChart3, Shield } from 'lucide-react';

const ForProfessionals = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Для психологов и специалистов
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PsyBalans как инструмент для работы с клиентами между сессиями
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Мониторинг клиентов
              </h3>
              <p className="text-gray-600 mb-4">
                Отслеживайте динамику состояния клиентов между сессиями с их согласия
              </p>
              <Button variant="outline">Узнать больше</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <FileText className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Домашние задания
              </h3>
              <p className="text-gray-600 mb-4">
                Назначайте упражнения и практики из базы PsyBalans
              </p>
              <Button variant="outline">Попробовать</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <BarChart3 className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Аналитика прогресса
              </h3>
              <p className="text-gray-600 mb-4">
                Получайте объективные данные о динамике терапии
              </p>
              <Button variant="outline">Подробнее</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <Shield className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Этика и безопасность
              </h3>
              <p className="text-gray-600 mb-4">
                Соблюдение конфиденциальности и профессиональных стандартов
              </p>
              <Button variant="outline">Документы</Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            Присоединиться к программе для специалистов
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForProfessionals;
