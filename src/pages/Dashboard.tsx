import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Search, 
  Send, 
  Calendar, 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Smile,
  Battery,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Привет! Как дела сегодня? Расскажи о своем настроении 😊',
      time: '10:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'Утром чувствовал себя бодро, но к обеду появилась усталость',
      time: '10:32'
    },
    {
      id: 3,
      type: 'bot',
      content: 'Понимаю. Это довольно частое явление. Давай разберем возможные причины. Как твой сон последние дни?',
      time: '10:33'
    }
  ]);

  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    activities: i >= 7 && i <= 22 ? ['💼', '🏃‍♂️', '🍽️', '📚'][Math.floor(Math.random() * 4)] : null
  }));

  const balanceData = [
    { label: 'Работа', value: 75, color: 'bg-blue-500' },
    { label: 'Отдых', value: 60, color: 'bg-green-500' },
    { label: 'Спорт', value: 40, color: 'bg-yellow-500' },
    { label: 'Отношения', value: 80, color: 'bg-purple-500' },
    { label: 'Питание', value: 70, color: 'bg-red-500' },
    { label: 'Сон', value: 55, color: 'bg-indigo-500' }
  ];

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: Date.now(),
        type: 'user',
        content: message,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
      
      // Симуляция ответа бота
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          content: 'Спасибо за ответ! Я анализирую ваши паттерны и подготовлю персональные рекомендации.',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PsyBalans
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-emerald-600 font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Дневники
              </Button>
              <Button variant="ghost">
                <Calendar className="w-4 h-4 mr-2" />
                Календарь
              </Button>
              <Button variant="ghost">
                <Activity className="w-4 h-4 mr-2" />
                Состояние
              </Button>
              <Button variant="ghost">
                <Target className="w-4 h-4 mr-2" />
                Рекомендации
              </Button>
              <Button variant="ghost">
                <Zap className="w-4 h-4 mr-2" />
                Упражнения
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Поиск..." 
                  className="pl-10 w-64"
                />
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-emerald-100 text-emerald-600">АП</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - AI Chat */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col bg-white/70 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span>AI Дневник</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg p-3 rounded-2xl ${
                          msg.type === 'user' 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Расскажите о своем состоянии..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500"
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity Timeline */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Лента активности</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="px-6">
                    {timeSlots.map((slot) => (
                      <div key={slot.hour} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div className="w-16 text-sm font-medium text-gray-600">
                          {slot.hour.toString().padStart(2, '0')}:00
                        </div>
                        <div className="flex-1 h-8 bg-gray-50 rounded-lg flex items-center px-3">
                          {slot.activities && (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{slot.activities}</span>
                              <div className="h-2 bg-emerald-400 rounded-full w-12"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Balance Wheel - Full Width Below */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <span>Колесо баланса</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {balanceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-gray-600">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats and Recommendations - Full Width Below */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="lg:col-span-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                    <CardContent className="p-4 text-center">
                      <Smile className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-700">7.5</p>
                      <p className="text-sm text-emerald-600">Настроение</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <Battery className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-700">6.2</p>
                      <p className="text-sm text-yellow-600">Энергия</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recommendations */}
              <div className="lg:col-span-2">
                <Card className="bg-white/70 backdrop-blur-lg border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span>Рекомендации</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Дыхательная практика</h4>
                            <p className="text-sm text-blue-700">Попробуйте 5-минутное дыхательное упражнение для снижения стресса</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">Перерыв на прогулку</h4>
                            <p className="text-sm text-green-700">15-минутная прогулка поможет восстановить энергию</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-purple-900">Режим сна</h4>
                            <p className="text-sm text-purple-700">Рекомендуем лечь спать на час раньше сегодня</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
