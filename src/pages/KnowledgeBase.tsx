
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Play, Headphones, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const KnowledgeBase = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            База знаний
          </h1>
          <p className="text-gray-600 mb-6">
            Научно обоснованные материалы для понимания психологии и самопознания
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Поиск статей, видео, подкастов..." className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  <span className="text-sm text-gray-500">Статья • 8 мин чтения</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Нейробиология привычек: как мозг формирует автоматизмы
                </h3>
                <p className="text-gray-600 text-sm">
                  Научные исследования о том, как формируются и изменяются наши привычки на уровне нейронных связей.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KnowledgeBase;
