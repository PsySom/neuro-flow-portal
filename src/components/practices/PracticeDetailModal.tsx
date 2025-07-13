
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, Calendar, Heart, Star, Timer, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contentTypes, therapyMethods, problems, objects, subObjects } from '@/constants/practicesConstants';
import BreathingAnimationDialog from './BreathingAnimationDialog';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: string;
  level: string;
  participants: string;
  category: string;
  therapyMethods: string[];
  problems: string[];
  objects: string[];
  tags: string[];
  color: string;
  instructions?: string;
  questions?: string[] | { question: string; options: string[]; }[];
  keys?: string;
  responseFormat?: string;
}

interface PracticeDetailModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PracticeDetailModal: React.FC<PracticeDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [testResult, setTestResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const { toast } = useToast();

  if (!item) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Убрано из избранного" : "Добавлено в избранное",
      description: `"${item.title}"`,
    });
  };

  const handleRating = (value: number) => {
    setRating(value);
    toast({
      title: "Оценка сохранена",
      description: `Вы оценили "${item.title}" на ${value} звезд`,
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Запланировано",
      description: `"${item.title}" добавлено в расписание`,
    });
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateTestResult = () => {
    if (!item.questions || !item.keys) return;
    
    const totalQuestions = item.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Ошибка",
        description: "Ответьте на все вопросы",
        variant: "destructive"
      });
      return;
    }

    let score = 0;

    // Специальная обработка для Шкалы депрессии Бека
    if (item.title.includes("Шкала депрессии Бека")) {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });

      let interpretation = '';
      if (score <= 13) {
        interpretation = 'Минимальная депрессия - показатели в пределах нормы';
      } else if (score <= 19) {
        interpretation = 'Легкая депрессия - рекомендуется наблюдение и поддержка';
      } else if (score <= 28) {
        interpretation = 'Умеренная депрессия - рекомендуется консультация специалиста';
      } else {
        interpretation = 'Тяжелая депрессия - настоятельно рекомендуется обратиться к специалисту';
      }

      setTestResult(`Результат: ${score} баллов из 63 возможных\n\nИнтерпретация: ${interpretation}\n\nОбратите внимание: данный тест носит информационный характер и не заменяет профессиональную диагностику.`);
    } else if (item.title.includes("когнитивные искажения") || item.keys === "cognitive_distortions_scale") {
      // Специальная обработка для теста на когнитивные искажения
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });

      let interpretation = '';
      let recommendations = '';
      
      if (score <= 20) {
        interpretation = 'Когнитивные искажения выражены слабо';
        recommendations = 'Поздравляем! Ваше мышление в целом гибкое и рациональное. Когнитивные искажения бывают у всех, но у вас они редко мешают.';
      } else if (score <= 40) {
        interpretation = 'Искажения встречаются иногда';
        recommendations = 'У вас встречаются отдельные когнитивные искажения, это нормально. Обратите внимание на шаблоны, набравшие больше баллов, и попробуйте работать с ними с помощью саморефлексии или упражнений.';
      } else if (score <= 60) {
        interpretation = 'Искажения выражены умеренно';
        recommendations = 'Некоторые шаблоны мышления могут мешать вам в повседневной жизни и усиливать стресс. Рекомендуется изучить техники КПТ, поработать с дневниками мыслей и при необходимости обратиться к специалисту.';
      } else {
        interpretation = 'Искажения выражены сильно';
        recommendations = 'У вас выражены стойкие когнитивные искажения, которые могут влиять на настроение, самооценку и качество жизни. Рекомендована работа с психологом (КПТ, mindfulness), изучение и проработка негативных автоматических мыслей.';
      }

      setTestResult(`Результат: ${score} баллов из 80 возможных\n\nИнтерпретация: ${interpretation}\n\nРекомендации: ${recommendations}\n\nОбратите внимание: данный тест носит информационный характер и не заменяет профессиональную диагностику.`);
    } else if (item.keys === "wurs_adhd_scale") {
      // Специальная обработка для WURS (СДВГ)
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });

      let interpretation = '';
      let recommendations = '';
      
      if (score <= 30) {
        interpretation = 'Симптомы СДВГ выражены слабо или отсутствуют';
        recommendations = 'Признаков СДВГ по шкале не выявлено. Ваше внимание, саморегуляция и организация в пределах нормы.';
      } else if (score <= 49) {
        interpretation = 'Возможны отдельные черты СДВГ';
        recommendations = 'У вас есть отдельные черты, схожие с проявлениями СДВГ. Это встречается у многих людей, особенно в стрессовых ситуациях. Обратите внимание на саморегуляцию, попробуйте техники планирования, осознанности. При выраженных трудностях — обратитесь к специалисту.';
      } else {
        interpretation = 'Высока вероятность наличия выраженных симптомов СДВГ';
        recommendations = 'Ваши ответы говорят о выраженных симптомах СДВГ. Это может влиять на работу, учёбу, отношения и эмоциональное состояние. Рекомендуется обратиться к врачу или психологу для профессиональной диагностики и рекомендаций.';
      }

      setTestResult(`Результат: ${score} баллов из 100 возможных\n\nИнтерпретация: ${interpretation}\n\nРекомендации: ${recommendations}\n\nОбратите внимание: данный тест носит информационный характер и не заменяет профессиональную диагностику.`);
    } else if (item.keys === "y_bocs_scale") {
      // Специальная обработка для Y-BOCS (ОКР)
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });

      let interpretation = '';
      let recommendations = '';
      
      if (score <= 7) {
        interpretation = 'ОКР выражено минимально или отсутствует (норма)';
        recommendations = 'Симптомы ОКР отсутствуют или выражены минимально, не мешают жизни.';
      } else if (score <= 15) {
        interpretation = 'Лёгкая степень ОКР';
        recommendations = 'Лёгкие проявления ОКР, можно попробовать техники самопомощи и контроля тревоги.';
      } else if (score <= 23) {
        interpretation = 'Умеренная степень ОКР';
        recommendations = 'Симптомы ОКР средней степени, рекомендуется обратить внимание на способы управления тревогой и обсудить с психологом.';
      } else if (score <= 31) {
        interpretation = 'Выраженная степень ОКР';
        recommendations = 'Ярко выраженные симптомы, которые заметно мешают жизни — настоятельно рекомендована консультация специалиста.';
      } else {
        interpretation = 'Крайне выраженное ОКР';
        recommendations = 'Крайне выраженные симптомы — необходима срочная профессиональная помощь.';
      }

      setTestResult(`Результат: ${score} баллов из 40 возможных\n\nИнтерпретация: ${interpretation}\n\nРекомендации: ${recommendations}\n\nОбратите внимание: высокий балл не является диагнозом! Диагноз ставит специалист, опираясь на подробное обследование и беседу.`);
    } else {
      // Обычная логика для других тестов
      Object.values(answers).forEach(answer => {
        if (answer === 'да' || answer === 'часто' || answer === 'согласен') {
          score += 1;
        }
      });

      const percentage = (score / totalQuestions) * 100;
      let result = '';
      
      if (percentage >= 70) {
        result = 'Высокий уровень - рекомендуется обратиться к специалисту';
      } else if (percentage >= 40) {
        result = 'Средний уровень - стоит обратить внимание на эту область';
      } else {
        result = 'Низкий уровень - показатели в норме';
      }

      setTestResult(`Результат: ${score}/${totalQuestions} баллов (${percentage.toFixed(0)}%)\n${result}`);
    }

    setShowResult(true);
  };

  const getMethodLabels = (methodIds: string[]) => {
    return methodIds.map(id => therapyMethods.find(m => m.id === id)?.label || id);
  };

  const getProblemLabels = (problemIds: string[]) => {
    return problemIds.map(id => problems.find(p => p.id === id)?.label || id);
  };

  const getObjectLabels = (objectIds: string[]) => {
    return objectIds.map(id => objects.find(o => o.id === id)?.label || id);
  };

  const getSubObjectLabels = (objectIds: string[]) => {
    const subObjectLabels: string[] = [];
    objectIds.forEach(objectId => {
      const objectSubObjects = subObjects[objectId as keyof typeof subObjects];
      if (objectSubObjects) {
        objectSubObjects.forEach(subObj => {
          if (!subObjectLabels.includes(subObj.label)) {
            subObjectLabels.push(subObj.label);
          }
        });
      }
    });
    return subObjectLabels;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Продолжительность: {item.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Участники: {item.participants}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Уровень: </span>
                  <Badge variant="outline">{item.level}</Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Тип: </span>
                  <Badge variant="secondary">
                    {contentTypes.find(t => t.id === item.type)?.label}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{item.description}</p>

              {/* Терапевтические методы */}
              {item.therapyMethods.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Терапевтические методы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getMethodLabels(item.therapyMethods).map((method, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Проблемы */}
              {item.problems.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Проблемы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getProblemLabels(item.problems).map((problem, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {problem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Объекты и подобъекты */}
              {item.objects.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Объекты:</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {getObjectLabels(item.objects).map((object, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {object}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getSubObjectLabels(item.objects).map((subObject, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {subObject}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Контент упражнения или теста */}
          {item.type === 'tests' && item.questions ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Тест</h3>
                
                {item.instructions && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Инструкция:</h4>
                    <p className="text-sm text-gray-700">{item.instructions}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {item.questions.map((questionData, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      {/* Обработка разных форматов вопросов */}
                      {typeof questionData === 'string' ? (
                        // Старый формат - простые строки
                        <>
                          <h5 className="font-medium mb-3">{index + 1}. {questionData}</h5>
                          <RadioGroup
                            value={answers[index] || ''}
                            onValueChange={(value) => handleAnswerChange(index, value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="да" id={`q${index}-yes`} />
                              <Label htmlFor={`q${index}-yes`}>Да</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="нет" id={`q${index}-no`} />
                              <Label htmlFor={`q${index}-no`}>Нет</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="иногда" id={`q${index}-sometimes`} />
                              <Label htmlFor={`q${index}-sometimes`}>Иногда</Label>
                            </div>
                          </RadioGroup>
                        </>
                      ) : (
                        // Новый формат - объекты с вопросом и вариантами
                        <>
                          <h5 className="font-medium mb-3">{index + 1}. {questionData.question}</h5>
                          <RadioGroup
                            value={answers[index] || ''}
                            onValueChange={(value) => handleAnswerChange(index, value)}
                          >
                            {questionData.options.map((option: string, optionIndex: number) => (
                              <div key={optionIndex} className="flex items-start space-x-2 mb-2">
                                <RadioGroupItem 
                                  value={optionIndex.toString()} 
                                  id={`q${index}-option${optionIndex}`} 
                                />
                                <Label 
                                  htmlFor={`q${index}-option${optionIndex}`}
                                  className="text-sm leading-relaxed cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {!showResult && (
                  <Button onClick={calculateTestResult} className="mt-6 w-full">
                    Получить результат
                  </Button>
                )}

                {showResult && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Ваш результат:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{testResult}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Упражнение</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Инструкция:</h4>
                    <p className="text-gray-700">
                      {item.instructions || `Следуйте указаниям ниже для выполнения упражнения "${item.title}".`}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Заметки:</h4>
                    <Textarea 
                      placeholder="Записывайте свои мысли и наблюдения во время выполнения упражнения..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Кнопки действий */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              size="lg" 
              className={`bg-gradient-to-r ${item.color}`}
              onClick={() => {
                if (item.title.includes('Дыхание 4-7-8') || item.title.includes('Дыхательная техника 4-7-8')) {
                  setShowBreathingAnimation(true);
                } else {
                  toast({
                    title: "Упражнение началось",
                    description: `Выполняем "${item.title}"`,
                  });
                }
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              Начать
            </Button>
            
            <Button variant="outline" size="lg" onClick={handleSchedule}>
              <Calendar className="w-4 h-4 mr-2" />
              Запланировать
            </Button>
            
            <Button 
              variant={isLiked ? "default" : "outline"} 
              size="lg" 
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'В избранном' : 'В избранное'}
            </Button>
          </div>

          {/* Рейтинг */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">Оценить:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="transition-colors"
              >
                <Star 
                  className={`w-5 h-5 ${
                    star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`} 
                />
              </button>
            ))}
          </div>

          {/* Теги */}
          {item.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-center">Теги:</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      
      <BreathingAnimationDialog
        open={showBreathingAnimation}
        onOpenChange={setShowBreathingAnimation}
      />
    </Dialog>
  );
};

export default PracticeDetailModal;
