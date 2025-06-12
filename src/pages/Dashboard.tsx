

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
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
  AlertCircle,
  Plus,
  MoreHorizontal,
  Edit,
  Star,
  Trash2,
  Info
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

  const activities = [
    { id: 1, name: 'Сон', emoji: '😴', startTime: '00:00', endTime: '08:00', duration: '8 ч', color: 'bg-indigo-200', importance: 5, completed: true, type: 'восстановление', needEmoji: '🛌' },
    { id: 2, name: 'Пробуждение', emoji: '☀️', startTime: '08:00', endTime: '08:30', duration: '30 мин', color: 'bg-yellow-200', importance: 3, completed: true, type: 'восстановление', needEmoji: '⚡' },
    { id: 3, name: 'Зарядка', emoji: '🏃‍♂️', startTime: '08:30', endTime: '09:30', duration: '1 ч', color: 'bg-green-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '💪' },
    { id: 4, name: 'Душ, завтрак, гигиена', emoji: '🚿', startTime: '09:30', endTime: '10:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '🧘' },
    { id: 5, name: 'Утренний дневник', emoji: '📝', startTime: '10:00', endTime: '10:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
    { id: 6, name: 'Дорога на работу', emoji: '🚗', startTime: '10:30', endTime: '11:00', duration: '30 мин', color: 'bg-gray-200', importance: 2, completed: false, type: 'задача' },
    { id: 7, name: 'Работа над проектом', emoji: '💼', startTime: '11:00', endTime: '12:00', duration: '1 ч', color: 'bg-orange-200', importance: 5, completed: false, type: 'задача' },
    { id: 8, name: 'Перерыв на кофе', emoji: '☕', startTime: '12:00', endTime: '12:30', duration: '30 мин', color: 'bg-amber-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌱' },
    { id: 9, name: 'Работа с документами', emoji: '📋', startTime: '13:00', endTime: '14:00', duration: '1 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
    { id: 10, name: 'Обед', emoji: '🍽️', startTime: '14:00', endTime: '14:30', duration: '30 мин', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
    { id: 11, name: 'Прогулка', emoji: '🚶‍♂️', startTime: '14:30', endTime: '15:00', duration: '30 мин', color: 'bg-emerald-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌳' },
    { id: 12, name: 'Работа с документами', emoji: '📋', startTime: '15:00', endTime: '17:00', duration: '2 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
    { id: 13, name: 'Встреча с другом', emoji: '👥', startTime: '17:00', endTime: '19:00', duration: '2 ч', color: 'bg-pink-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '❤️' },
    { id: 14, name: 'Ужин', emoji: '🍽️', startTime: '19:00', endTime: '20:00', duration: '1 ч', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
    { id: 15, name: 'Просмотр фильма', emoji: '🎬', startTime: '20:00', endTime: '21:30', duration: '1.5 ч', color: 'bg-violet-200', importance: 2, completed: false, type: 'восстановление', needEmoji: '🎭' },
    { id: 16, name: 'Душ, гигиена', emoji: '🚿', startTime: '21:30', endTime: '22:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '🧘' },
    { id: 17, name: 'Заполнение дневника', emoji: '📝', startTime: '22:00', endTime: '22:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
    { id: 18, name: 'Подготовка ко сну', emoji: '🌙', startTime: '22:30', endTime: '24:00', duration: '1.5 ч', color: 'bg-indigo-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '😴' }
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const timeString = hour.toString().padStart(2, '0') + ':00';
    
    // Find activities for this hour
    const hourActivities = activities.filter(activity => {
      const startHour = parseInt(activity.startTime.split(':')[0]);
      const endHour = parseInt(activity.endTime.split(':')[0]);
      const endMinute = parseInt(activity.endTime.split(':')[1]);
      
      // Activity spans this hour
      return startHour <= hour && (endHour > hour || (endHour === hour && endMinute > 0));
    });

    return {
      hour,
      timeString,
      activities: hourActivities
    };
  });

  const getActivityHeight = (activity) => {
    const start = activity.startTime.split(':');
    const end = activity.endTime.split(':');
    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
    const durationMinutes = endMinutes - startMinutes;
    
    // Base height is 48px (h-12), scale by duration in hours
    return Math.max(48, (durationMinutes / 60) * 48);
  };

  const isActivityStart = (activity, hour) => {
    return parseInt(activity.startTime.split(':')[0]) === hour;
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - AI Chat (40% - reduced from 50%) */}
          <div className="lg:col-span-2">
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

          {/* Right Column - Activity Timeline (60% - increased from 50%) */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] bg-white/70 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Лента активности</span>
                </CardTitle>
                <Button size="icon" className="rounded-full bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="px-6">
                    {timeSlots.map((slot) => (
                      <div key={slot.hour} className="flex items-start py-1 border-b border-gray-100 last:border-b-0 min-h-[48px]">
                        <div className="w-16 text-sm font-medium text-gray-600 py-2">
                          {slot.timeString}
                        </div>
                        <div className="flex-1 relative">
                          {slot.activities.length > 0 ? (
                            slot.activities.map((activity) => 
                              isActivityStart(activity, slot.hour) ? (
                                <div 
                                  key={activity.id} 
                                  className={`${activity.color} rounded-lg p-3 mb-2 border border-gray-200`}
                                  style={{ height: `${getActivityHeight(activity)}px` }}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                      <span className="text-lg">{activity.emoji}</span>
                                      {activity.type === 'восстановление' && (
                                        <span className="text-sm">{activity.needEmoji}</span>
                                      )}
                                      <span className="font-medium text-sm">{activity.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Checkbox 
                                        checked={activity.completed}
                                        className="w-4 h-4"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                                    <span>[{activity.startTime}-{activity.endTime}]</span>
                                    <span>[{activity.duration}]</span>
                                    <div className="flex items-center">
                                      {Array.from({ length: activity.importance }, (_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 flex items-center space-x-1">
                                    <Button size="icon" variant="ghost" className="h-6 w-6">
                                      <Info className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6">
                                      <Star className="w-3 h-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6">
                                      <Trash2 className="w-3 h-3 text-red-500" />
                                    </Button>
                                  </div>
                                </div>
                              ) : null
                            )
                          ) : (
                            <div className="h-12 bg-gray-50 rounded-lg flex items-center justify-center opacity-50 hover:opacity-75 cursor-pointer">
                              <Plus className="w-4 h-4 text-gray-400" />
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
          <div className="lg:col-span-5">
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
          <div className="lg:col-span-5">
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

