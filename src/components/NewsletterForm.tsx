
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Sparkles, Check } from 'lucide-react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Здесь была бы логика отправки email
    }
  };

  return (
    <section className="animate-fade-in">
      <Card className="bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 border-0 shadow-2xl text-white overflow-hidden relative">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
        </div>

        <CardContent className="relative p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            {!isSubscribed ? (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Получайте персональные подборки
                </h2>
                <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                  Еженедельные материалы, подобранные AI на основе ваших интересов и прогресса. 
                  Новые упражнения, научные открытия и практические советы.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                    required
                  />
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-0 px-8"
                  >
                    Подписаться
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </form>

                <p className="text-sm text-emerald-200 mt-4">
                  Без спама. Только ценный контент. Отписка в любой момент.
                </p>
              </>
            ) : (
              <div className="animate-scale-in">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Спасибо за подписку! 🎉
                </h2>
                <p className="text-lg text-emerald-100 mb-6">
                  Первая подборка придет в течение 24 часов. 
                  А пока можете изучить нашу базу знаний.
                </p>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => setIsSubscribed(false)}
                >
                  Вернуться к форме
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default NewsletterForm;
