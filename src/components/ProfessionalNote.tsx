
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, UserCheck, Shield, ArrowRight } from 'lucide-react';

const ProfessionalNote = () => {
  return (
    <section className="animate-fade-in">
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-0 shadow-xl">
        <CardContent className="p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Не замена психолога, а{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                компаньон для самостоятельной заботы
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              PsyBalance дополняет работу с психологом, предоставляя инструменты для ежедневной 
              поддержки и самоанализа между сессиями. Мы не ставим диагнозы и не заменяем 
              профессиональную помощь — мы помогаем вам лучше понимать себя.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Самопомощь</h3>
                <p className="text-sm text-gray-600">
                  Инструменты для ежедневной заботы о ментальном здоровье
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Безопасность</h3>
                <p className="text-sm text-gray-600">
                  Научный подход без попыток заменить профессиональную помощь
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Поддержка</h3>
                <p className="text-sm text-gray-600">
                  Дополнительные ресурсы между встречами с психологом
                </p>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Для специалистов в области ментального здоровья
              </h3>
              <p className="text-gray-600 mb-4">
                Интегрируйте PsyBalance в свою практику для отслеживания прогресса клиентов 
                и предоставления им дополнительных инструментов самопомощи.
              </p>
              <Button variant="outline" className="hover:bg-emerald-50 hover:border-emerald-300">
                Узнать больше для специалистов
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfessionalNote;
