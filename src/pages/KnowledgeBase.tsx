import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Play, Headphones, Users, Search, Filter, Clock, Star, Download, Share2 } from 'lucide-react';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('articles');

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'wellbeing', name: 'Психологическое благополучие' },
    { id: 'emotions', name: 'Работа с эмоциями' },
    { id: 'thinking', name: 'Когнитивные навыки' },
    { id: 'relationships', name: 'Отношения' },
    { id: 'habits', name: 'Привычки и изменения' },
    { id: 'self-compassion', name: 'Самосострадание' },
    { id: 'depression', name: 'Депрессия и аффективные расстройства' },
    { id: 'physiology', name: 'Физиология и ритмы' }
  ];

  const colorSchemes = [
    { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-600', hover: 'hover:border-emerald-400' },
    { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-600', hover: 'hover:border-blue-400' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-300 dark:border-purple-600', hover: 'hover:border-purple-400' },
    { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-600', hover: 'hover:border-amber-400' },
    { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-300 dark:border-pink-600', hover: 'hover:border-pink-400' },
    { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-300 dark:border-teal-600', hover: 'hover:border-teal-400' },
    { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-300 dark:border-indigo-600', hover: 'hover:border-indigo-400' },
    { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-300 dark:border-orange-600', hover: 'hover:border-orange-400' },
    { bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-300 dark:border-cyan-600', hover: 'hover:border-cyan-400' },
    { bg: 'bg-lime-50 dark:bg-lime-900/20', border: 'border-lime-300 dark:border-lime-600', hover: 'hover:border-lime-400' },
    { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-300 dark:border-red-600', hover: 'hover:border-red-400' },
    { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-600', hover: 'hover:border-violet-400' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Самооценка: современный взгляд, связь с самокритикой и самоподдержкой',
      description: 'Научный подход к пониманию самооценки, механизмов самокритики и развитию навыков самосострадания. Практические выводы для повседневной жизни.',
      category: 'self-compassion',
      readTime: '12 мин чтения',
      tags: ['Самооценка', 'Самосострадание', 'КПТ'],
      isFavorite: true,
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
          <p>Современная наука (Neff, 2003; Gilbert, 2010) предлагает концепцию самосострадания (self-compassion, самоподдержки): это умение относиться к себе с доброжелательностью, поддерживать себя в трудностях и не терять контакт с внутренней человечностью.</p>
          
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
    },
    {
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

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
            <h3 class="font-semibold text-blue-900 mb-2">🎯 Рекомендуемые упражнения и дневники</h3>
            <div class="text-blue-800 text-sm space-y-3">
              <div>
                <h4 class="font-semibold">Дневники:</h4>
                <ul class="ml-4 space-y-1">
                  <li>• <strong>Дневник заботливого выхода из депрессии</strong> — комплексный инструмент для ежедневного отслеживания состояния и планирования восстановления</li>
                  <li>• <strong>Дневник эмоций</strong> — для развития эмоциональной осознанности и навыков регуляции</li>
                  <li>• <strong>Дневник мыслей</strong> — структурированная работа с негативными автоматическими мыслями</li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold">Упражнения:</h4>
                <ul class="ml-4 space-y-1">
                  <li>• <strong>Техники дыхания 4-7-8</strong> — для снижения тревожности и стресса</li>
                  <li>• <strong>Сканирование тела</strong> — медитативная практика для осознанности и расслабления</li>
                  <li>• <strong>Колесо эмоций</strong> — интерактивный инструмент для определения и работы с эмоциями</li>
                  <li>• <strong>Когнитивная реструктуризация</strong> — техники КПТ для работы с искаженными мыслями</li>
                  <li>• <strong>Практики самосострадания</strong> — развитие доброжелательного отношения к себе</li>
                </ul>
              </div>
            </div>
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
    },
    {
      id: 8,
      title: 'В ритме человека: циклы напряжения и расслабления',
      description: 'Научно обоснованная статья о том, как работают наши внутренние ритмы и почему важно соблюдать баланс между активностью и отдыхом.',
      category: 'physiology',
      readTime: '20 мин чтения',
      tags: ['Ритмы', 'Саморегуляция', 'Нейрофизиология', 'Восстановление'],
      isFavorite: false,
      views: 1850,
      content: null
    },
    {
      id: 3,
      title: 'Что такое психологическое здоровье: научный взгляд',
      description: 'Современные исследования о компонентах психологического благополучия и способах его поддержания.',
      category: 'wellbeing',
      readTime: '8 мин чтения',
      tags: ['Основы', 'Наука'],
      isFavorite: false,
      views: 1250
    },
    {
      id: 4,
      title: 'Нейронаука привычек: как мозг создает автоматизмы',
      description: 'Глубокое погружение в механизмы формирования привычек на уровне нейронных связей.',
      category: 'habits',
      readTime: '12 мин чтения',
      tags: ['Нейронаука', 'Привычки'],
      isFavorite: true,
      views: 890
    },
    {
      id: 5,
      title: 'Эмоциональная регуляция: от реакции к ответу',
      description: 'Практические техники управления эмоциями и развития эмоционального интеллекта.',
      category: 'emotions',
      readTime: '10 мин чтения',
      tags: ['Эмоции', 'Практика'],
      isFavorite: false,
      views: 2100
    },
    {
      id: 6,
      title: 'Когнитивные искажения: 15 ловушек мышления',
      description: 'Разбор наиболее распространенных ошибок мышления и способов их преодоления.',
      category: 'thinking',
      readTime: '15 мин чтения',
      tags: ['КПТ', 'Мышление'],
      isFavorite: false,
      views: 1680
    },
    {
      id: 7,
      title: 'Теория привязанности во взрослых отношениях',
      description: 'Как стили привязанности влияют на наши отношения и что с этим делать.',
      category: 'relationships',
      readTime: '14 мин чтения',
      tags: ['Привязанность', 'Отношения'],
      isFavorite: true,
      views: 1420
    }
  ];

  const podcasts = [
    {
      id: 1,
      title: 'Наука о благополучии: интервью с ведущими исследователями',
      description: 'Разговор с экспертами о последних открытиях в области позитивной психологии.',
      duration: '35 мин',
      category: 'wellbeing',
      tags: ['Интервью', 'Наука'],
      downloads: 4200
    },
    {
      id: 2,
      title: 'КПТ на практике: техники для ежедневного использования',
      description: 'Практические упражнения когнитивно-поведенческой терапии для самостоятельной работы.',
      duration: '28 мин',
      category: 'thinking',
      tags: ['КПТ', 'Практика'],
      downloads: 3100
    },
    {
      id: 3,
      title: 'История изменений: преодоление тревожности',
      description: 'Реальная история человека, который справился с тревожным расстройством.',
      duration: '22 мин',
      category: 'emotions',
      tags: ['История', 'Тревога'],
      downloads: 2800
    }
  ];

  const interactiveTools = [
    {
      id: 1,
      title: 'Тест на уровень стресса (PSS-10)',
      description: 'Научно валидированная шкала для оценки воспринимаемого стресса.',
      type: 'test',
      duration: '5 мин',
      icon: null,
      category: 'wellbeing'
    },
    {
      id: 2,
      title: '21-дневный челлендж благодарности',
      description: 'Интерактивная программа развития практики благодарности.',
      type: 'challenge',
      duration: '21 день',
      icon: null,
      category: 'wellbeing'
    },
    {
      id: 3,
      title: 'Дневник мыслей (КПТ-формат)',
      description: 'Структурированный инструмент для работы с автоматическими мыслями.',
      type: 'tool',
      duration: 'Ежедневно',
      icon: null,
      category: 'thinking'
    },
    {
      id: 4,
      title: 'SMART-планировщик целей',
      description: 'Интерактивный планировщик для постановки и достижения целей.',
      type: 'planner',
      duration: 'Разово',
      icon: null,
      category: 'habits'
    }
  ];

  const professionalResources = [
    {
      id: 1,
      title: 'Мета-анализы эффективности подходов',
      description: 'Обзор современных исследований эффективности различных терапевтических подходов.',
      type: 'research',
      category: 'professional',
      tags: ['Мета-анализ', 'Эффективность']
    },
    {
      id: 2,
      title: 'Интеграция приложений в терапевтический процесс',
      description: 'Методические рекомендации по использованию цифровых инструментов в терапии.',
      type: 'methodology',
      category: 'professional',
      tags: ['Методика', 'Цифровые инструменты']
    },
    {
      id: 3,
      title: 'Этические аспекты использования AI в терапии',
      description: 'Обсуждение этических вопросов применения искусственного интеллекта в психологии.',
      type: 'ethics',
      category: 'professional',
      tags: ['Этика', 'AI']
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTools = interactiveTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Психологическая грамотность — основа осознанной жизни
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Тщательно отобранная коллекция современных научных данных, практических инсайтов и экспертных материалов, 
            представленных в доступной форме. Здесь вы найдете всё необходимое для самостоятельного развития, 
            повышения осознанности и поддержки работы с психологом.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Поиск материалов..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="podcasts" className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Подкасты
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Интерактив
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Для специалистов
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                return (
                  <Card key={article.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Star className={`w-4 h-4 ${article.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                        <span>👁 {article.views}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/article/${article.id}`)}
                        >
                          Читать
                        </Button>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Podcasts Tab */}
          <TabsContent value="podcasts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPodcasts.map((podcast, index) => {
                const colorScheme = colorSchemes[(index + 6) % colorSchemes.length];
                return (
                  <Card key={podcast.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Headphones className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{podcast.duration}</span>
                            <span>•</span>
                            <span>↓ {podcast.downloads}</span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {podcast.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {podcast.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {podcast.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="hover:bg-purple-50">
                          <Play className="w-4 h-4 mr-2" />
                          Слушать
                        </Button>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Interactive Tab */}
          <TabsContent value="interactive" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => {
                const colorScheme = colorSchemes[(index + 3) % colorSchemes.length];
                return (
                  <Card key={tool.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          {tool.icon ? <tool.icon className="w-6 h-6 text-blue-600" /> : null}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-gray-500 capitalize">{tool.type}</span>
                          <div className="text-xs text-gray-400">{tool.duration}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {tool.description}
                      </p>
                      
                      <Button className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" variant="outline">
                        Начать
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionalResources.map((resource, index) => {
                const colorScheme = colorSchemes[(index + 9) % colorSchemes.length];
                return (
                  <Card key={resource.id} className={`${colorScheme.bg} border-2 ${colorScheme.border} ${colorScheme.hover} transition-all duration-300 group cursor-pointer hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-sm text-gray-500 capitalize">{resource.type}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Button variant="outline" size="sm" className="hover:bg-indigo-50">
                        Изучить
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Начните с любого материала — и каждый ваш шаг станет частью вашей истории перемен!
              </h2>
              <p className="text-gray-600 mb-6">
                Подпишитесь на новые материалы и подборки по темам, которые для вас актуальны
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Подписаться на обновления
                </Button>
                <Button variant="outline">
                  Предложить тему
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KnowledgeBase;
