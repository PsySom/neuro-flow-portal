
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MessageCircle, Heart, Coffee, Zap } from 'lucide-react';

const AIDiary = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const questions = [
    {
      text: "Привет! Я ваш AI-помощник 🤖 Как ваше настроение прямо сейчас?",
      options: [
        { emoji: "😊", label: "Отлично", value: "great" },
        { emoji: "😌", label: "Хорошо", value: "good" },
        { emoji: "😐", label: "Нормально", value: "okay" },
        { emoji: "😔", label: "Не очень", value: "low" },
        { emoji: "😤", label: "Стресс", value: "stressed" }
      ]
    },
    {
      text: "Понятно! А какой у вас сейчас уровень энергии?",
      options: [
        { emoji: "⚡", label: "Полон сил", value: "high" },
        { emoji: "🔋", label: "Заряжен", value: "good" },
        { emoji: "🔄", label: "Средне", value: "medium" },
        { emoji: "🪫", label: "Устал", value: "low" },
        { emoji: "😴", label: "Выжат", value: "exhausted" }
      ]
    },
    {
      text: "Спасибо! И последний вопрос — что сегодня главное в ваших планах?",
      options: [
        { emoji: "🎯", label: "Работать", value: "work" },
        { emoji: "🧘", label: "Отдыхать", value: "rest" },
        { emoji: "📚", label: "Учиться", value: "learn" },
        { emoji: "👥", label: "Общаться", value: "social" },
        { emoji: "🌱", label: "Развиваться", value: "grow" }
      ]
    }
  ];

  const handleResponse = (value) => {
    const newResponses = { ...responses, [currentStep]: value };
    setResponses(newResponses);
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 500);
    }
  };

  const isCompleted = currentStep === questions.length - 1 && responses[currentStep];

  return (
    <section className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ваш персональный AI-дневник
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Интеллектуальная система понимает ваши паттерны и адаптируется под ваш ритм жизни
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              AI Ассистент
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Прогресс */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Текущий вопрос */}
            {currentStep < questions.length && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start space-x-4">
                  <MessageCircle className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <p className="text-lg text-gray-800 font-medium">
                    {questions[currentStep].text}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {questions[currentStep].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 hover:scale-105"
                      onClick={() => handleResponse(option.value)}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {option.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Результат */}
            {isCompleted && (
              <div className="text-center space-y-6 animate-scale-in">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Спасибо за откровенность! 💚
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Основываясь на ваших ответах, я подготовил персональные рекомендации.
                    Войдите, чтобы сохранить результаты и получить доступ к полному анализу.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      Войти / Регистрация
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setCurrentStep(0);
                      setResponses({});
                    }}>
                      Попробовать ещё раз
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AIDiary;
