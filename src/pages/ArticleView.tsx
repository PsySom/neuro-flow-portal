import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TableOfContents from '../components/article/TableOfContents';
import ArticleContent from '../components/article/ArticleContent';
import RecommendedTools from '../components/article/RecommendedTools';
import { ArrowLeft, Heart, Download, Share2, Clock, Eye, BookOpen, Brain, Lightbulb, Target } from 'lucide-react';

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Table of Contents for the depression article
  const tableOfContents = [
    { id: 'what-is-depression', title: 'Что такое депрессия?' },
    { id: 'mechanisms', title: 'Как работает депрессия: механизмы и уровни проявления' },
    { id: 'neurophysiology', title: 'Нейрофизиологические механизмы' },
    { id: 'physiological', title: 'Физиологические проявления' },
    { id: 'emotional', title: 'Эмоциональные проявления' },
    { id: 'cognitive', title: 'Когнитивные проявления' },
    { id: 'behavioral', title: 'Поведенческие проявления' },
    { id: 'impact', title: 'На что влияет депрессия' },
    { id: 'history', title: 'История открытия и исследований депрессии' },
    { id: 'diagnosis', title: 'Как диагностируют депрессию' },
    { id: 'types', title: 'Виды депрессии: полный список' },
    { id: 'treatment', title: 'Как лечат депрессию' },
    { id: 'recommendations', title: 'Рекомендации для клиентов и специалистов' },
    { id: 'conclusion', title: 'Заключение' }
  ];

  // Article data
  const article = {
    id: 2,
    title: 'Депрессия: современное понимание, механизмы, виды и путь к выздоровлению',
    description: 'Полный научно-популярный обзор депрессивных расстройств: виды, механизмы развития, симптомы и современные подходы к лечению.',
    category: 'depression',
    readTime: '25 мин чтения',
    tags: ['Депрессия', 'Аффективные расстройства', 'Диагностика', 'Лечение'],
    isFavorite: true,
    views: 3250,
    content: `
      <div class="prose max-w-none">
        
        <h2 id="what-is-depression">Что такое депрессия?</h2>
        <p>Депрессия — это не просто грусть или реакция на неприятности. Это целый спектр психических расстройств, связанных с длительным и устойчивым снижением настроения, утратой интереса к жизни, изменениями мышления, поведения, физиологии. Она может затрагивать каждого: ребёнка, взрослого, пожилого, мужчину и женщину. Важно понимать: депрессия — не слабость, не "ленивость", не выбор, а серьёзное многоуровневое состояние, требующее внимания, поддержки и часто профессионального вмешательства.</p>

        <h2 id="mechanisms">Как работает депрессия: механизмы и уровни проявления</h2>

        <h3 id="neurophysiology">1. Нейрофизиологические механизмы</h3>
        <p>На уровне мозга депрессия связана с нарушением работы ряда ключевых систем:</p>

        <p><strong>Нейромедиаторы</strong> — вещества, с помощью которых нейроны обмениваются сигналами. Особенно важны серотонин, норадреналин, дофамин. При депрессии их баланс и работа меняются, что влияет на настроение, энергию, мотивацию (Nestler et al., 2002).</p>

        <p><strong>Нейроэндокринная система</strong> — при депрессии часто наблюдается избыток гормонов стресса (кортизол), нарушения циркадных ритмов.</p>

        <p><strong>Структуры мозга</strong> — исследования на МРТ показывают изменения в работе гиппокампа, префронтальной коры, миндалины (Drevets et al., 2008). Эти участки связаны с эмоциями, памятью, планированием и саморегуляцией.</p>

        <h3 id="physiological">2. Физиологические проявления</h3>
        <p>Депрессия — это не только «в голове». Часто она проявляется:</p>
        <ul>
          <li>Нарушением сна (бессонница или чрезмерная сонливость)</li>
          <li>Изменением аппетита и веса</li>
          <li>Хронической усталостью, снижением энергии, ощущением «тяжести» в теле</li>
          <li>Головными болями, болями в спине, нарушением работы ЖКТ</li>
          <li>Замедленностью движений или, наоборот, внутренней «ажитацией»</li>
        </ul>

        <h3 id="emotional">3. Эмоциональные проявления</h3>
        <ul>
          <li>Стойкое снижение настроения, тоска, опустошённость</li>
          <li>Потеря радости, интереса к жизни, к любимым занятиям</li>
          <li>Чувство безнадёжности, собственной никчёмности, вины</li>
          <li>Чувство внутренней пустоты, отчаяния</li>
          <li>Иногда — раздражительность, злость</li>
        </ul>

        <h3 id="cognitive">4. Когнитивные проявления</h3>
        <ul>
          <li>Преобладание негативных мыслей о себе, мире, будущем (Beck, 2008)</li>
          <li>Нарушение концентрации, затруднения в принятии решений</li>
          <li>Пессимизм, катастрофизация будущего</li>
          <li>«Вязкость» мышления, ощущение, что мысли «тяжёлые» или замедленные</li>
          <li>Часто — самокритика, самоуничижение</li>
        </ul>

        <h3 id="behavioral">5. Поведенческие проявления</h3>
        <ul>
          <li>Снижение активности, уход от общения</li>
          <li>Потеря интереса к работе, учёбе, хобби</li>
          <li>Пренебрежение собой, уходом за домом, внешним видом</li>
          <li>Существенное снижение инициативы, стремления что-либо менять</li>
          <li>Иногда — злоупотребление алкоголем, переедание или другие вредные привычки</li>
        </ul>

        <h2 id="impact">На что влияет депрессия</h2>
        <ul>
          <li>Качество жизни и работоспособность (снижение продуктивности, пропуски работы, трудности в учёбе)</li>
          <li>Отношения с близкими, друзьями (отдаление, недопонимание, раздражительность)</li>
          <li>Физическое здоровье (усиление болей, обострение хронических заболеваний)</li>
          <li>Уровень безопасности (в тяжёлых случаях — суицидальные мысли и действия)</li>
        </ul>

        <h2 id="history">История открытия и исследований депрессии</h2>
        <p><strong>Античность:</strong> О депрессии писали ещё Гиппократ и Гален (тогда это называлось «меланхолией»).</p>
        <p><strong>XIX-XX век:</strong> Клиническое описание депрессии как самостоятельного заболевания. Э. Крепелин ввёл понятие «маникально-депрессивного психоза».</p>
        <p><strong>XX век:</strong> Открытие антидепрессантов, формирование когнитивной теории депрессии (Аарон Бек), появление современных психотерапевтических методов.</p>
        <p><strong>Современность:</strong> Исследования нейробиологии депрессии, разработка новых медикаментов, использование нейровизуализации для изучения мозговых изменений, акцент на комплексном подходе в лечении.</p>

        <h2 id="diagnosis">Как диагностируют депрессию</h2>
        <ul>
          <li>Диагноз ставится на основании клинического интервью, анализа симптомов по международным критериям (DSM-5, МКБ-10/11).</li>
          <li>Симптомы должны длиться не менее двух недель и существенно снижать качество жизни.</li>
          <li>Обязателен учёт физического состояния (чтобы исключить болезни, «маскирующиеся» под депрессию).</li>
          <li>Психологические опросники: шкала Бека, опросник депрессии Гамильтона, PHQ-9 и другие.</li>
        </ul>

        <h2 id="types">Виды депрессии: полный список с пояснениями и симптомами</h2>

        <h3>1. Большое депрессивное расстройство (Major Depressive Disorder, MDD, F32/6A70)</h3>
        <p><strong>Классическая форма:</strong></p>
        <ul>
          <li>Устойчивая тоска, потеря интереса, энергия на нуле.</li>
          <li>Нарушение сна и аппетита, снижение концентрации.</li>
          <li>Чувство вины, никчёмности, мысли о смерти.</li>
        </ul>

        <h3>2. Рекуррентное депрессивное расстройство (F33/6A71)</h3>
        <p>Эпизоды депрессии чередуются с периодами нормального состояния.</p>

        <h3>3. Дистимия (персистирующее депрессивное расстройство, F34.1/6A72)</h3>
        <ul>
          <li>Менее выраженные симптомы, но длящиеся годами.</li>
          <li>Часто ощущается как «постоянная тяжесть», хроническая неудовлетворённость.</li>
        </ul>

        <h3>4. Биполярное аффективное расстройство (F31/6A60-6A61)</h3>
        <ul>
          <li>Чередование депрессивных и маниакальных/гипоманиакальных фаз.</li>
          <li>В депрессивной фазе симптомы могут быть даже тяжелее, чем при обычной депрессии.</li>
        </ul>

        <h3>5. Сезонное аффективное расстройство (САР)</h3>
        <ul>
          <li>Обострение депрессии в определённое время года, чаще зимой.</li>
          <li>Симптомы: упадок сил, сонливость, переедание, тоска.</li>
        </ul>

        <h3>6. Послеродовая депрессия (F53)</h3>
        <ul>
          <li>Развивается в течение нескольких недель после родов.</li>
          <li>Симптомы: подавленность, тревожность, чувство вины, страх за ребёнка, трудности в установлении контакта с малышом.</li>
        </ul>

        <h3>7. Атипичная депрессия</h3>
        <ul>
          <li>Реактивное улучшение настроения на приятные события.</li>
          <li>Повышенный аппетит и сонливость, чувство тяжести в теле, чувствительность к критике.</li>
        </ul>

        <h3>8. Смешанное тревожно-депрессивное расстройство (F41.2/6A73)</h3>
        <p>Симптомы депрессии и тревоги одновременно, без преобладания одного из синдромов.</p>

        <h3>9. Скрытая (маскированная, соматизированная) депрессия</h3>
        <ul>
          <li>Преобладают физические жалобы (боли, усталость), при этом печаль, тоска могут быть слабо выражены.</li>
          <li>Часто диагностируется у людей, не склонных выражать чувства.</li>
        </ul>

        <h3>10. Психотическая депрессия (F32.3/6A70.3)</h3>
        <ul>
          <li>Депрессия с бредом (вины, ничтожности, ипохондрическим) или галлюцинациями.</li>
          <li>Тяжёлое, опасное для жизни состояние.</li>
        </ul>

        <h3>11. Малая депрессия</h3>
        <ul>
          <li>Симптомы депрессии есть, но не в полном объёме (например, менее выражены или не все критерии).</li>
          <li>Может быть переходной формой.</li>
        </ul>

        <h3>12. Кататоническая депрессия</h3>
        <p>Двигательная заторможенность или возбуждение, странные позы, молчание.</p>

        <h3>13. Депрессия у детей и подростков</h3>
        <p>Может проявляться раздражительностью, капризами, отказом от общения, агрессией, снижением успеваемости.</p>

        <h3>14. Депрессия, связанная с физическими болезнями или приёмом медикаментов</h3>
        <p>Может быть вызвана хроническими заболеваниями, гормональными нарушениями, приёмом некоторых лекарств.</p>

        <h3>15. Депрессия без грусти</h3>
        <p>Основные жалобы — апатия, усталость, отсутствие инициативы, при этом классической тоски или печали нет.</p>

        <h2 id="treatment">Как лечат депрессию</h2>

        <h3>1. Психотерапия</h3>
        <ul>
          <li><strong>Когнитивно-поведенческая терапия (КПТ)</strong> — золотой стандарт, работает с негативными мыслями и стратегиями поведения.</li>
          <li><strong>Интерперсональная терапия (ИПТ)</strong> — фокус на отношениях, социальных ролях.</li>
          <li><strong>Терапия, сфокусированная на сострадании (CFT) и ACT</strong> — развитие самоподдержки, принятия себя и своих эмоций.</li>
          <li>Семейная, групповая терапия, арт-терапия, телесно-ориентированные методы.</li>
        </ul>

        <h3>2. Медикаментозное лечение</h3>
        <ul>
          <li>Антидепрессанты (селективные ингибиторы обратного захвата серотонина — СИОЗС, трициклические, другие).</li>
          <li>Стабилизаторы настроения, антипсихотики — при БАР или психотической депрессии.</li>
          <li><strong>Назначаются только врачом!</strong></li>
          <li>Подбор препаратов индивидуален и требует времени, контроля.</li>
        </ul>

        <h3>3. Биологические методы</h3>
        <ul>
          <li>Светотерапия (при сезонной депрессии)</li>
          <li>Электросудорожная терапия (при тяжёлых формах, резистентности к лекарствам)</li>
          <li>Новые методы: транскраниальная магнитная стимуляция (ТМС), кетамин-терапия (строго по показаниям).</li>
        </ul>

        <h3>4. Социальная поддержка и изменение образа жизни</h3>
        <ul>
          <li>Поддержка близких, группы взаимопомощи</li>
          <li>Регулярная физическая активность (даже простая ходьба доказанно снижает симптомы)</li>
          <li>Стабильный режим сна, питание, ограничение алкоголя и стимуляторов</li>
          <li>Уменьшение стресса, планирование отдыха</li>
        </ul>

        <h2 id="recommendations">Рекомендации для клиентов и специалистов</h2>
        <ul>
          <li><strong>Не ждите, что «пройдёт само»</strong> — своевременное обращение за помощью значительно ускоряет выздоровление и предотвращает хронизацию.</li>
          <li><strong>Ведите дневник эмоций и самочувствия</strong> — это помогает замечать изменения и понимать, когда нужна поддержка.</li>
          <li><strong>Относитесь к себе с доброжелательством:</strong> депрессия — не «порок», не «плохой характер», а заболевание, требующее сочувствия и терпения.</li>
          <li><strong>Обязательно обращайтесь за профессиональной помощью</strong> при мыслях о суициде, выраженной безнадёжности, стойком ухудшении состояния.</li>
          <li><strong>Для специалистов:</strong> помните, что депрессия у каждого может проявляться по-разному. Используйте комплексный подход и учитывайте индивидуальные особенности клиента.</li>
        </ul>

        <h2 id="conclusion">Заключение</h2>
        <p>Депрессия — сложное, но поддающееся лечению состояние, о котором важно говорить честно и открыто. Понимание природы депрессии, разнообразия её форм, механизмов и современных способов помощи даёт надежду и силу на пути к восстановлению. Заботьтесь о себе, поддерживайте близких, не бойтесь обращаться за помощью — и помните: даже самое тяжёлое состояние можно преодолеть с поддержкой, знаниями и участием.</p>

        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 my-6">
          <h3 class="font-semibold text-emerald-900 mb-2">💡 Важно помнить</h3>
          <p class="text-emerald-800 text-sm">Если у вас есть вопросы — не стесняйтесь задавать. Если вы — психолог, используйте эти знания для поддержки клиентов и своей работы. Если вы столкнулись с депрессией сами — вы не одни, помощь возможна, и жизнь может вновь наполниться смыслом!</p>
        </div>

        <h3>Научные источники и литература:</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>American Psychiatric Association. DSM-5.</li>
          <li>World Health Organization. ICD-10, ICD-11.</li>
          <li>Beck, A. T. (2008). The evolution of the cognitive model of depression.</li>
          <li>Malhi, G. S. et al. (2018). The science of depression. Journal of Affective Disorders.</li>
          <li>Nestler, E. J., et al. (2002). Neurobiology of depression. Neuron.</li>
          <li>Drevets, W. C. et al. (2008). Brain structural and functional abnormalities in mood disorders.</li>
          <li>NICE (2022). Depression in adults: recognition and management.</li>
          <li>Cuijpers, P. et al. (2021). Psychological treatment of depression: A meta-analytic database.</li>
          <li>Neff, K. D., & Germer, C. K. (2013). A pilot study and randomized controlled trial of the mindful self-compassion program.</li>
        </ul>
      </div>
    `
  };

  const recommendedTools = [
    {
      id: 1,
      title: 'Тест на депрессию PHQ-9',
      description: 'Научно валидированный скрининговый тест для оценки уровня депрессии',
      type: 'test',
      icon: BookOpen,
      category: 'depression',
      link: '/tests/depression-phq9'
    },
    {
      id: 2,
      title: 'Шкала депрессии Бека (BDI-II)',
      description: 'Классический инструмент для измерения тяжести депрессивной симптоматики',
      type: 'test',
      icon: BookOpen,
      category: 'depression', 
      link: '/tests/beck-depression'
    },
    {
      id: 3,
      title: 'Дневник заботливого выхода из депрессии',
      description: 'Комплексный инструмент для ежедневного отслеживания состояния и планирования восстановления',
      type: 'diary',
      icon: Heart,
      category: 'depression',
      link: '/diaries/depression-care'
    },
    {
      id: 4,
      title: 'Дневник мыслей',
      description: 'Структурированная работа с негативными автоматическими мыслями по методу КПТ',
      type: 'diary',
      icon: Brain,
      category: 'thoughts',
      link: '/diaries/thoughts'
    },
    {
      id: 5,
      title: 'Дневник эмоций',
      description: 'Для развития эмоциональной осознанности и навыков регуляции',
      type: 'diary',
      icon: Heart,
      category: 'emotions',
      link: '/diaries/mood'
    },
    {
      id: 6,
      title: 'Техники дыхания 4-7-8',
      description: 'Для снижения тревожности, стресса и улучшения эмоционального состояния',
      type: 'exercise',
      icon: Lightbulb,
      category: 'stress',
      link: '/practices'
    },
    {
      id: 7,
      title: 'Сканирование тела',
      description: 'Медитативная практика для осознанности, расслабления и снижения соматических симптомов',
      type: 'exercise',
      icon: Target,
      category: 'mindfulness',
      link: '/practices'
    },
    {
      id: 8,
      title: 'Когнитивная реструктуризация',
      description: 'Техники КПТ для работы с искаженными негативными мыслями',
      type: 'exercise',
      icon: Brain,
      category: 'cognitive',
      link: '/practices'
    },
    {
      id: 9,
      title: 'Практики самосострадания',
      description: 'Развитие доброжелательного отношения к себе и снижение самокритики',
      type: 'exercise',
      icon: Heart,
      category: 'self-compassion',
      link: '/practices'
    },
    {
      id: 10,
      title: 'Поведенческая активация',
      description: 'Планирование приятных и значимых активностей для преодоления апатии',
      type: 'exercise',
      icon: Target,
      category: 'behavioral',
      link: '/practices'
    }
  ];

  useEffect(() => {
    setLikes(Math.floor(Math.random() * 100) + 50);
  }, []);

  // Scroll spy effect for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDownload = () => {
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <div className="lg:col-span-1">
            <TableOfContents 
              items={tableOfContents}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
            />
          </div>

          {/* Article Content */}
          <div className="lg:col-span-3">
            <ArticleContent content={article.content} />
            <RecommendedTools tools={recommendedTools} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleView;
