
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Heart, Download, Share2, Clock, Eye, BookOpen, Brain, Lightbulb, Target } from 'lucide-react';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Данные статьи - в реальном приложении это будет загружаться из API
  const article = {
    id: 2,
    title: 'Депрессия: современное понимание, виды, механизмы и помощь',
    description: 'Комплексный научный обзор депрессивных расстройств: виды, механизмы развития, симптомы и современные подходы к лечению.',
    category: 'depression',
    readTime: '18 мин чтения',
    tags: ['Депрессия', 'Аффективные расстройства', 'Диагностика'],
    isFavorite: true,
    views: 3250,
    content: `
      <div class="prose max-w-none">
        <p>Депрессия — одно из самых распространённых и коварных психических расстройств современности. О ней говорят много, но далеко не всегда понимают, насколько разнообразны её проявления и как важно вовремя получить поддержку. Для специалистов важно видеть нюансы, а для клиентов — не оставаться с этим состоянием один на один.</p>

        <h2>Что такое депрессия?</h2>
        <p>С точки зрения современной психологии и психиатрии, депрессия — это не просто «плохое настроение» или «ленивость». Это комплексное аффективное расстройство, включающее эмоциональные, когнитивные, физические и поведенческие симптомы, которые сохраняются не менее двух недель и нарушают обычную жизнь человека (American Psychiatric Association, DSM-5, 2013).</p>

        <p>Механика депрессии связана с нарушением баланса нейромедиаторов (серотонина, норадреналина, дофамина), изменениями в работе мозга, хроническим стрессом и уязвимыми психическими стратегиями. Но важно помнить: депрессия — не признак слабости, а сложный, многоуровневый сбой, в котором сочетаются биологические, психологические и социальные факторы (Beck, 2008; Malhi et al., 2018).</p>

        <h2>Основные виды депрессивных расстройств</h2>
        
        <h3>1. Большое депрессивное расстройство (БДР, Major Depressive Disorder, MDD)</h3>
        <p>Самая распространённая форма, характеризуется устойчивой подавленностью, снижением интереса к жизни, снижением энергии, трудностями концентрации и выраженными изменениями в аппетите, сне, самооценке и мотивации.</p>

        <h3>2. Дистимия (персистирующее депрессивное расстройство)</h3>
        <p>Менее выраженная по интенсивности, но длительная (от двух лет и дольше) форма депрессии. Часто люди с дистимией воспринимают своё состояние как "особенность характера", а не как расстройство.</p>

        <h3>3. Биполярное аффективное расстройство (БАР)</h3>
        <p>Сочетает депрессивные эпизоды и фазы гипомании/мании. Важно отличать БАР от униполярной депрессии, так как лечение различается (Goodwin, Jamison, 2007).</p>

        <h3>4. Сезонное аффективное расстройство (САР)</h3>
        <p>Депрессия, связанная с определённым временем года (чаще зимой), обычно облегчение наступает с наступлением весны и увеличением светового дня.</p>

        <h3>5. Послеродовая депрессия</h3>
        <p>Развивается у женщин после родов и требует отдельного внимания, поскольку сочетает биологические, гормональные и психосоциальные факторы.</p>

        <h3>6. Атипичная депрессия</h3>
        <p>Может проявляться реактивным улучшением настроения на положительные события, выраженной усталостью, повышенным аппетитом и чувством тяжести в теле.</p>

        <h2>Симптомы депрессии</h2>
        <p>Для всех форм депрессии характерны следующие основные симптомы (NICE, 2022):</p>
        
        <ul>
          <li><strong>Устойчиво сниженное настроение</strong>, чувство тоски или пустоты</li>
          <li><strong>Потеря интереса</strong> к прежним увлечениям, хобби, общению</li>
          <li><strong>Нарушения сна</strong> (бессонница или гиперсомния)</li>
          <li><strong>Изменения аппетита</strong> (потеря или усиление)</li>
          <li><strong>Усталость</strong>, потеря энергии, ощущение «тяжести» в теле</li>
          <li><strong>Чувство собственной никчёмности</strong>, вины, сниженная самооценка</li>
          <li><strong>Трудности концентрации</strong>, снижение скорости мышления</li>
          <li><strong>Мысли о смерти или суициде</strong> (иногда — суицидальные попытки)</li>
          <li><strong>Физические симптомы</strong>: боли, нарушения ЖКТ, головные боли без очевидной причины</li>
        </ul>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
          <h3 class="font-semibold text-red-900 mb-2">⚠️ Важно!</h3>
          <p class="text-red-800 text-sm">Не обязательно присутствие всех симптомов сразу — для постановки диагноза достаточно нескольких, но выраженных и устойчивых.</p>
        </div>

        <h2>Чем отличаются виды депрессии?</h2>
        <ul>
          <li><strong>По длительности:</strong> БДР обычно эпизодично, дистимия — хроническая, сезонное и послеродовое — связаны со временем года или жизненным этапом.</li>
          <li><strong>По интенсивности:</strong> БАР включает чередование фаз, атипичная депрессия часто менее заметна для окружающих, но мучительна для самого человека.</li>
          <li><strong>По сопутствующим симптомам:</strong> При некоторых формах на первый план могут выходить физические жалобы, апатия, раздражительность или тревога.</li>
        </ul>

        <h2>Механизмы и природа депрессии</h2>
        <p>Современные исследования показывают, что депрессия возникает в результате сложного взаимодействия:</p>
        
        <ul>
          <li><strong>Биологических факторов</strong> — генетическая предрасположенность, нарушения в работе нейротрансмиттеров (Nestler et al., 2002)</li>
          <li><strong>Психологических факторов</strong> — дезадаптивные схемы мышления (негативные убеждения о себе, мире и будущем; Beck, 2008), неэффективные копинг-стратегии, низкий уровень самосострадания и выраженная самокритика (Ehret et al., 2015)</li>
          <li><strong>Социальных факторов</strong> — одиночество, травматизация, отсутствие поддержки, хронические стрессы, кризисы.</li>
        </ul>

        <h2>Как отличить депрессию от просто "плохого настроения"?</h2>
        <ul>
          <li>Депрессия — это не реакция на одну неудачу или усталость.</li>
          <li>Симптомы сохраняются большую часть дня, почти ежедневно, не менее 2 недель.</li>
          <li>Они существенно ухудшают качество жизни, затрагивают работу, учёбу, отношения, самообслуживание.</li>
          <li>Часто человек перестаёт получать удовольствие даже от того, что раньше радовало («ангедония»).</li>
        </ul>

        <h2>Рекомендации для специалистов и клиентов</h2>
        
        <h3>1. Не оставайтесь один на один.</h3>
        <p>Депрессия часто сопровождается ощущением изоляции и «ненужности», но поддержка — важнейший фактор выздоровления (Cuijpers et al., 2021). Психотерапия (особенно когнитивно-поведенческая терапия, КПТ), медико-психологическая поддержка, группы взаимопомощи — всё это признанные эффективные стратегии.</p>

        <h3>2. Лечение — комплексное!</h3>
        <p>Комбинация психотерапии, иногда фармакотерапии (антидепрессанты — только по назначению врача!), работы с образом жизни (режим сна, физическая активность, питание, режим дня) показывает наилучшие результаты (NICE, 2022).</p>

        <h3>3. Обращайте внимание на самокритику и уровень самоподдержки.</h3>
        <p>Хроническая самокритика увеличивает риск депрессии, а развитие навыков самосострадания — снижает (Neff & Germer, 2013).</p>

        <h3>4. Следите за тревожными признаками.</h3>
        <p>Мысли о собственной никчёмности, бессмысленности жизни, суицидальные мысли — серьёзный сигнал обратиться за профессиональной помощью незамедлительно.</p>

        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 my-6">
          <h3 class="font-semibold text-emerald-900 mb-2">💡 Заключение</h3>
          <p class="text-emerald-800 text-sm">Депрессия — это не слабость и не «характер», а серьёзное, но поддающееся лечению состояние. Если вы или ваш близкий столкнулись с этим, важно не обвинять себя, а отнестись к себе с заботой и обратиться за поддержкой. Для психологов — помнить, что за каждой формой депрессии скрываются уникальные жизненные обстоятельства, истории и ресурсы, которые можно активировать в терапии.</p>
        </div>

        <h3>Ключевые научные источники:</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>American Psychiatric Association (2013). DSM-5: Diagnostic and Statistical Manual of Mental Disorders, 5th Edition.</li>
          <li>Beck, A. T. (2008). The evolution of the cognitive model of depression and its neurobiological correlates. American Journal of Psychiatry.</li>
          <li>Goodwin, F., Jamison, K. (2007). Manic-Depressive Illness: Bipolar Disorders and Recurrent Depression.</li>
          <li>Malhi, G. S. et al. (2018). The science of depression. Journal of Affective Disorders.</li>
          <li>Nestler, E. J., et al. (2002). Neurobiology of depression. Neuron.</li>
          <li>Cuijpers, P. et al. (2021). Psychological treatment of depression: A meta-analytic database of randomized studies.</li>
          <li>NICE (2022). Depression in adults: recognition and management.</li>
          <li>Ehret, A. M., Joormann, J., Berking, M. (2015). Examining risk and resilience factors for depression: The role of self-criticism and self-compassion.</li>
          <li>Neff, K. D., & Germer, C. K. (2013). A pilot study and randomized controlled trial of the mindful self-compassion program.</li>
        </ul>
      </div>
    `
  };

  const recommendedTools = [
    {
      id: 1,
      title: 'Дневник заботливого выхода из депрессии',
      description: 'Комплексный инструмент для ежедневного отслеживания состояния и планирования восстановления',
      type: 'diary',
      icon: BookOpen,
      category: 'depression',
      link: '/diaries/depression-care'
    },
    {
      id: 2,
      title: 'Дневник эмоций',
      description: 'Для развития эмоциональной осознанности и навыков регуляции',
      type: 'diary',
      icon: Heart,
      category: 'emotions',
      link: '/diaries/mood'
    },
    {
      id: 3,
      title: 'Дневник мыслей',
      description: 'Структурированная работа с негативными автоматическими мыслями',
      type: 'diary',
      icon: Brain,
      category: 'thoughts',
      link: '/diaries/thoughts'
    },
    {
      id: 4,
      title: 'Техники дыхания 4-7-8',
      description: 'Для снижения тревожности и стресса',
      type: 'exercise',
      icon: Lightbulb,
      category: 'stress',
      link: '/practices'
    },
    {
      id: 5,
      title: 'Сканирование тела',
      description: 'Медитативная практика для осознанности и расслабления',
      type: 'exercise',
      icon: Target,
      category: 'mindfulness',
      link: '/practices'
    },
    {
      id: 6,
      title: 'Когнитивная реструктуризация',
      description: 'Техники КПТ для работы с искаженными мыслями',
      type: 'exercise',
      icon: Brain,
      category: 'cognitive',
      link: '/practices'
    }
  ];

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 100) + 50);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
    // В реальном приложении здесь будет логика скачивания
    alert('Функция скачивания будет реализована в следующих версиях');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  if (!article) {
    return <div>Статья не найдена</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 hover:bg-emerald-50"
            onClick={() => navigate('/knowledge')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к базе знаний
          </Button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} просмотров</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`${isLiked ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-600' : ''}`} />
                {likes}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <ScrollArea className="h-auto">
              <div 
                className="prose prose-lg max-w-none prose-emerald"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recommended Tools Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-emerald-200">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Рекомендуемые упражнения и дневники
            </h2>
            <p className="text-gray-600 mb-6">
              Эти инструменты помогут вам применить знания из статьи на практике и развить навыки работы с депрессией, эмоциями и мыслями.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedTools.map((tool) => (
                <Card key={tool.id} className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {tool.type === 'diary' ? 'Дневник' : 'Упражнение'}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(tool.link)}
                            className="hover:bg-emerald-50"
                          >
                            {tool.type === 'diary' ? 'Открыть дневник' : 'Попробовать'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/practices')}
              >
                Посмотреть все упражнения и практики
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
