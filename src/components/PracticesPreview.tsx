import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Timer, Users, ArrowRight, Share2, Calendar, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPromptDialog from './practices/LoginPromptDialog';
import CreateActivityFromPracticeDialog from './practices/CreateActivityFromPracticeDialog';
import BreathingAnimationDialog from './practices/BreathingAnimationDialog';

const PracticesPreview = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [likesState, setLikesState] = useState({});
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCreateActivityDialog, setShowCreateActivityDialog] = useState(false);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const exercises = [
    {
      id: 1,
      title: 'Дыхательная техника 4-7-8',
      description: 'Эффективная дыхательная практика для быстрого снижения внутреннего напряжения, замедления сердцебиения и обретения покоя. Особенно полезна вечером, перед сном или в моменты волнения.',
      duration: '5 мин',
      difficulty: 'Легко',
      participants: '12.5k',
      tags: ['дыхание', 'релаксация', 'сон', 'напряжение', 'покой'],
      color: 'from-blue-400 to-blue-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50/50',
      buttonColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
      type: 'breathing',
      level: 'Легко',
      category: 'relaxation',
      therapyMethods: ['cbt', 'mindfulness'],
      problems: ['anxiety', 'stress', 'sleep', 'tension'],
      objects: ['emotions', 'state'],
      steps: [
        'Примите удобное положение',
        'Сделайте медленный выдох',
        'Вдохните через нос на 4 счёта',
        'Задержите дыхание на 7 счётов',
        'Выдохните через рот на 8 счётов'
      ]
    },
    {
      id: 2,
      title: 'Прогрессивная мышечная релаксация',
      description: 'Техника последовательного напряжения и расслабления мышц',
      duration: '15 мин',
      difficulty: 'Средне',
      participants: '8.3k',
      tags: ['релаксация', 'мышцы', 'напряжение'],
      color: 'from-green-400 to-green-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50/50',
      buttonColor: 'bg-gradient-to-r from-green-400 to-green-600',
      type: 'relaxation',
      level: 'Средне',
      category: 'relaxation',
      therapyMethods: ['relaxation', 'body_work'],
      problems: ['stress', 'tension', 'anxiety'],
      objects: ['behavior', 'state'],
      steps: [
        'Ложитесь удобно и закройте глаза',
        'Начните с напряжения мышц ног на 5 секунд',
        'Полностью расслабьте их',
        'Продолжайте с другими группами мышц',
        'Завершите полным расслаблением тела'
      ]
    },
    {
      id: 6,
      title: 'Техника заземления 5-4-3-2-1',
      description: 'Быстрая техника для возвращения в настоящий момент через органы чувств',
      duration: '3 мин',
      difficulty: 'Легко',
      participants: '15.7k',
      tags: ['заземление', 'паника', 'чувства'],
      color: 'from-red-400 to-red-600',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50/50',
      buttonColor: 'bg-gradient-to-r from-red-400 to-red-600',
      type: 'grounding',
      level: 'Легко',
      category: 'crisis',
      therapyMethods: ['mindfulness', 'grounding'],
      problems: ['panic', 'dissociation', 'anxiety'],
      objects: ['state', 'emotions'],
      steps: [
        'Назовите 5 вещей, которые видите',
        'Назовите 4 вещи, которые можете потрогать',
        'Назовите 3 вещи, которые слышите',
        'Назовите 2 вещи, которые чувствуете запах',
        'Назовите 1 вещь, которую можете попробовать на вкус'
      ]
    }
  ];

  const startExercise = (exerciseId) => {
    setActiveExercise(exerciseId);
  };

  const handleSchedule = (exercise) => {
    if (!isAuthenticated) {
      setSelectedExercise(exercise);
      setShowLoginDialog(true);
    } else {
      setSelectedExercise(exercise);
      setShowCreateActivityDialog(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowCreateActivityDialog(true);
  };

  const handlePostpone = (title) => {
    console.log(`Отложить: ${title}`);
  };

  const handleShare = (title) => {
    console.log(`Поделиться: ${title}`);
  };

  const handleLike = (exerciseId) => {
    setLikesState(prev => ({
      ...prev,
      [exerciseId]: {
        isLiked: !prev[exerciseId]?.isLiked,
        count: prev[exerciseId]?.isLiked 
          ? (prev[exerciseId]?.count || Math.floor(Math.random() * 100) + 10) - 1
          : (prev[exerciseId]?.count || Math.floor(Math.random() * 100) + 10) + 1
      }
    }));
  };

  const getLikesData = (exerciseId) => {
    return likesState[exerciseId] || { 
      isLiked: false, 
      count: Math.floor(Math.random() * 100) + 10 
    };
  };

  return (
    <>
      <section className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Упражнения и практики
          </h2>
          <p className="text-lg text-gray-600">
            Попробуйте и поделитесь результатами без регистрации
          </p>
        </div>

        <div className="space-y-6">
          {exercises.map((exercise) => {
            const likesData = getLikesData(exercise.id);
            
            return (
              <Card 
                key={exercise.id}
                className={`hover:shadow-lg transition-all duration-300 border-2 ${exercise.borderColor} ${exercise.bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${exercise.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {exercise.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {exercise.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Timer className="w-4 h-4" />
                          <span>{exercise.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{exercise.participants}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        {exercise.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {activeExercise === exercise.id ? (
                        <div className="bg-white rounded-lg p-4 border-2 border-emerald-200 animate-scale-in">
                          <h4 className="font-semibold text-gray-800 mb-3">Пошаговая инструкция:</h4>
                          <ol className="space-y-2 mb-4">
                            {exercise.steps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ol>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-emerald-500 hover:bg-emerald-600"
                              onClick={() => {
                                if (exercise.id === 1) { // Дыхание 4-7-8
                                  setShowBreathingAnimation(true);
                                } else {
                                  console.log(`Начать практику: ${exercise.title}`);
                                }
                              }}
                            >
                              Начать практику
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setActiveExercise(null)}>
                              Свернуть
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 flex-wrap gap-2">
                          <Button 
                            onClick={() => startExercise(exercise.id)}
                            className={`${exercise.buttonColor} hover:shadow-lg transition-all duration-200 text-white`}
                          >
                            Попробовать сейчас
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSchedule(exercise)}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Запланировать
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePostpone(exercise.title)}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Отложить
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShare(exercise.title)}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Поделиться
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLike(exercise.id)}
                            className={`${likesData.isLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${likesData.isLiked ? 'fill-red-500' : ''}`} />
                            {likesData.count}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 mb-4">
              💾 Результаты можно сохранить после входа • 📱 Легко делиться в социальных сетях
            </p>
            <Button 
              variant="outline" 
              className="hover:bg-emerald-50 hover:border-emerald-300"
              onClick={() => navigate('/practices')}
            >
              Открыть всю базу упражнений
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <LoginPromptDialog 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />

      <CreateActivityFromPracticeDialog
        open={showCreateActivityDialog}
        onOpenChange={setShowCreateActivityDialog}
        practiceItem={selectedExercise}
      />

      <BreathingAnimationDialog
        open={showBreathingAnimation}
        onOpenChange={setShowBreathingAnimation}
      />
    </>
  );
};

export default PracticesPreview;
