
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Timer, Target, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Practices = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Упражнения и практики
          </h1>
          <p className="text-gray-600 mb-6">
            Практические инструменты для работы с эмоциями и состояниями
          </p>
          
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Фильтры</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Timer className="w-4 h-4" />
                    <span>5 мин</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Дыхание 4-7-8
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Техника для быстрого снижения тревожности и засыпания
                </p>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                  Начать практику
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Practices;
