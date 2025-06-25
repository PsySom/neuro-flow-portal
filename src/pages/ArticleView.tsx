
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Heart, Download, Share2, BookOpen, PenTool, Clock, Eye } from 'lucide-react';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Данные о статьях (в реальном приложении будут из API)
  const articles = [
    {
      id: 1,
      title: 'Самооценка: современный взгляд, связь с самокритикой и самоподдержкой',
      description: 'Научный подход к пониманию самооценки, механизмов самокритики и развитию навыков самосострадания. Практические выводы для повседневной жизни.',
      category: 'self-compassion',
      readTime: '12 мин чтения',
      tags: ['Самооценка', 'Самосострадание', 'КПТ'],
      views: 2890,
      content: `
        <div class="prose max-w-none">
          <p>Поговорим о самооценке — теме, с которой сталкивается каждый человек и которую так важно изучать не только психологам, но и каждому, кто хочет лучше понять себя и поддержать внутренний рост.</p>
          
          <h2>Что такое самооценка с точки зрения современной психологии?</h2>
          <p>В научном смысле самооценка — это не просто «люблю ли я себя», а целая система восприятия собственной ценности, компетентности и уместности в этом мире (Rosenberg, 1965; Baumeister, 1993). Она формируется с раннего детства — из обратной связи близких, личного опыта, достижений, неудач, и в течение всей жизни остаётся подвижной, чутко реагируя на перемены и события.</p>
          
          <p>Самооценка включает несколько уровней:</p>
          <ul>
            <li><strong>Глобальный уровень</strong> — общее представление о себе как о личности,</li>
            <li><strong>Ситуативный</strong> — оценка себя в отдельных сферах (например, как профессионала, родителя, друга),</li>
            <li><strong>Динамический</strong> — способность сохранять устойчивое отношение к себе, несмотря на стресс и перемены.</li>
          </ul>
          
          <p>В исследованиях подчёркивается, что не столько «уровень» самооценки (высокий или низкий) предопределяет психологическое благополучие, сколько её устойчивость и гибкость — способность признавать свои слабые стороны, но не терять уважения и сочувствия к себе (Kernis, 2003).</p>
          
          <h2>Как самооценка связана с самокритикой?</h2>
          <p>Для многих людей внутренний диалог наполнен критическими замечаниями — и это не всегда плохо! Умеренная самокритика действительно может помогать замечать ошибки и расти. Но когда самокритика становится автоматической и чрезмерной, она лишает энергии и уверенности, превращается в источник стресса и эмоциональной боли (Gilbert, 2010).</p>
          
          <p>В психотерапии мы часто сталкиваемся с тем, что критикующие мысли приходят автоматически, человек не выбирает их сознательно — они скорее «случаются» как отклик на стереотипы, травматичный опыт или высокий уровень требований к себе (Blatt, 2004).</p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <h3 class="font-semibold text-blue-900 mb-2">Что важно для клиентов:</h3>
            <ul class="text-blue-800 text-sm space-y-1">
              <li>• Самокритика — это не сам человек, а его автоматические мысли.</li>
              <li>• Эти мысли могут быть неосознанными, но если их замечать и осмыслять, с ними можно работать — они поддаются переосмыслению и трансформации.</li>
            </ul>
          </div>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <h3 class="font-semibold text-green-900 mb-2">Что важно для психологов:</h3>
            <ul class="text-green-800 text-sm space-y-1">
              <li>• Самокритика — частый сопутствующий механизм низкой или неустойчивой самооценки.</li>
              <li>• Задача — не «уничтожить» внутреннего критика, а научить клиента распознавать его голос, анализировать его функции и находить более поддерживающие стратегии внутреннего диалога.</li>
            </ul>
          </div>
          
          <h2>Самоподдержка — альтернатива автоматической самокритике</h2>
          <p>Современная наука (Neff, 2003; Gilbert, 2010) предлагает концепцию самосострадания (self-compassion, самоподдержки): это умение относиться к себе с доброжелательством, поддерживать себя в трудностях и не терять контакт с внутренней человечностью.</p>
          
          <p>Самоподдержка состоит из трёх компонентов (Neff, 2003):</p>
          <ol>
            <li><strong>Осознанность</strong> — умение замечать свои чувства и внутренние переживания, не избегая их и не подавляя.</li>
            <li><strong>Человечность общего опыта</strong> — признание, что ошибки и страдания универсальны, они делают нас людьми, а не изгоями.</li>
            <li><strong>Доброжелательность</strong> — способность быть к себе таким же заботливым, как к другу.</li>
          </ol>
          
          <h2>Как найти баланс?</h2>
          <p>Научные данные однозначны:</p>
          <ul>
            <li>Крайняя самокритика разрушает уверенность и инициирует эмоциональные проблемы (Barnard & Curry, 2011).</li>
            <li>Гипертрофированная, «нарциссическая» самооценка мешает обучению и росту (Baumeister et al., 2003).</li>
            <li>Баланс между честной рефлексией и поддержкой — основа психологического здоровья и развития.</li>
          </ul>
          
          <h2>Практические выводы</h2>
          <p>Самооценка может быть изменчива, но мы можем влиять на её качество, тренируя осознанность, принимая свои чувства и формируя поддерживающий внутренний диалог.</p>
          
          <p>Психотерапия — это пространство, где можно безопасно исследовать свою самооценку, научиться различать голоса внутреннего критика и внутреннего друга, и постепенно делать выбор в пользу заботы о себе.</p>
          
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 my-6">
            <h3 class="font-semibold text-emerald-900 mb-2">💡 Заключение</h3>
            <p class="text-emerald-800 text-sm">Пусть ваша самооценка будет для вас не приговором, а точкой опоры для роста. Если вы замечаете в себе автоматическую самокритику — это не слабость, а возможность для осознанных изменений и практики доброжелательного отношения к себе.</p>
          </div>
          
          <h3>Научные источники:</h3>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>Rosenberg, M. (1965). Society and the Adolescent Self-Image.</li>
            <li>Baumeister, R. F. (1993). Self-Esteem: The Puzzle of Low Self-Regard.</li>
            <li>Kernis, M. H. (2003). Toward a conceptualization of optimal self-esteem.</li>
            <li>Blatt, S. J. (2004). Experiences of Depression: Theoretical, Clinical, and Research Perspectives.</li>
            <li>Neff, K. D. (2003). Self-compassion: An alternative conceptualization of a healthy attitude toward oneself.</li>
            <li>Gilbert, P. (2010). Compassion Focused Therapy.</li>
            <li>Barnard, L. K., & Curry, J. F. (2011). Self-compassion: Conceptualizations, correlates, & interventions.</li>
          </ul>
        </div>
      `
    }
  ];

  const article = articles.find(a => a.id === parseInt(id || '1'));

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
            <Button onClick={() => navigate('/knowledge')}>
              Вернуться к базе знаний
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recommendedDiaries = [
    {
      title: 'Дневник самооценки',
      description: 'Структурированная работа с самооценкой, самокритикой и самоподдержкой',
      icon: PenTool,
      link: '/diary/self-esteem'
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleDownload = () => {
    // Создаем текстовую версию статьи для скачивания
    const element = document.createElement('a');
    const file = new Blob([article.content.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${article.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Ошибка при поделиться:', err);
      }
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header с кнопкой назад */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/knowledge')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к базе знаний
          </Button>
        </div>

        {/* Заголовок статьи */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>
            </div>
            
            {/* Действия */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Содержимое статьи */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <ScrollArea className="h-auto">
              <div 
                className="prose max-w-none prose-lg prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Рекомендуемые материалы */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Рекомендуемые практики и дневники
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedDiaries.map((diary, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <diary.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-lg">{diary.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{diary.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(diary.link)}
                  >
                    Начать работу
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA секция */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Понравилась статья?
            </h3>
            <p className="text-gray-600 mb-6">
              Поделитесь ей с друзьями или сохраните для повторного чтения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </Button>
              <Button onClick={() => navigate('/knowledge')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Другие статьи
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
