
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ArticlePracticalAspects: React.FC = () => {
  return (
    <ScrollArea className="h-auto">
      <div className="prose prose-lg max-w-none prose-emerald">
        <a name="диагностика-депрессии"></a>
        <h2 id="диагностика-депрессии">Диагностика: как распознать депрессию</h2>
        <p>В диагностике депрессии используется международная классификация (МКБ-10, МКБ-11, DSM-5) и специализированные шкалы:</p>

        <ul>
          <li>Шкала депрессии Бека (BDI)</li>
          <li>Шкала Гамильтона</li>
          <li>Госпитальная шкала тревоги и депрессии</li>
          <li>PHQ-9</li>
        </ul>

        <h3>Главные критерии:</h3>
        <ul>
          <li>Симптомы должны сохраняться минимум 2 недели</li>
          <li>Нарушается привычная жизнь (работа, учёба, отношения, гигиена)</li>
          <li>Возможны мысли о смерти</li>
        </ul>

        <h3>Обследование включает:</h3>
        <ul>
          <li>Интервью с врачом (психиатром, психотерапевтом)</li>
          <li>Оценку физического состояния, анализы (чтобы исключить другие болезни)</li>
          <li>Самонаблюдение, дневники состояния</li>
        </ul>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
          <p className="text-red-800 text-sm"><strong>Важно!</strong> Диагноз может поставить только врач. Не занимайтесь самодиагностикой, если есть суицидальные мысли — обратитесь за срочной помощью!</p>
        </div>

        <a name="лечение-депрессии"></a>
        <h2 id="лечение-депрессии">Как лечат депрессию</h2>

        <h3>Психотерапия</h3>
        <ul>
          <li><strong>Когнитивно-поведенческая терапия (КПТ):</strong> помогает работать с автоматическими негативными мыслями и убеждениями, менять поведение, формировать новые навыки. Одна из самых изученных и эффективных методик.</li>
          <li><strong>Интерперсональная терапия:</strong> фокус на отношениях, социальных ролях и стрессах.</li>
          <li><strong>Майндфулнесс и техники осознанности:</strong> тренируют способность замечать эмоции и управлять вниманием, выходить из состояния «жвачки мыслей».</li>
          <li><strong>ACT, терапия, сфокусированная на сострадании:</strong> работа с принятием себя и самоподдержкой, развитием устойчивости.</li>
        </ul>

        <h3>Фармакотерапия</h3>
        <ul>
          <li>Антидепрессанты (чаще всего — селективные ингибиторы обратного захвата серотонина и другие современные препараты).</li>
          <li>Назначаются только врачом, подбираются индивидуально, требуют регулярного контроля.</li>
          <li>В некоторых случаях применяются стабилизаторы настроения, антипсихотики.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <p className="text-blue-800 text-sm"><strong>Комментарий:</strong> В лёгких случаях возможно лечение только психотерапией. Средняя и тяжёлая депрессия почти всегда требуют комбинации с медикаментами.</p>
        </div>

        <h3>Биологические и дополнительные методы</h3>
        <ul>
          <li>Светотерапия (при сезонной депрессии)</li>
          <li>Электросудорожная терапия (при тяжёлых, резистентных формах)</li>
          <li>Новые методы (ТМС, кетамин — только под медицинским контролем)</li>
        </ul>

        <h3>Рекомендации для специалистов и клиентов</h3>
        <ul>
          <li>Не отменяйте лекарства самостоятельно</li>
          <li>Двигайтесь к изменениям шаг за шагом, фиксируйте даже маленькие успехи</li>
          <li>Уделяйте внимание режиму сна, питанию, физической активности</li>
        </ul>

        <a name="профилактика-и-самопомощь"></a>
        <h2 id="профилактика-и-самопомощь">Профилактика и самопомощь</h2>
        <ul>
          <li><strong>Двигайтесь каждый день.</strong> Даже короткие прогулки и лёгкая зарядка доказанно уменьшают риск депрессии и ускоряют выздоровление.</li>
          <li><strong>Соблюдайте режим дня и гигиену сна.</strong> Старайтесь ложиться и вставать в одно и то же время, ограничивайте использование гаджетов вечером.</li>
          <li><strong>Общайтесь!</strong> Не изолируйте себя, поддержка — важный фактор профилактики и выздоровления.</li>
          <li><strong>Ведите дневник:</strong> фиксируйте свои мысли, успехи, благодарности, даже маленькие.</li>
          <li><strong>Тренируйте самосострадание:</strong> учитесь быть к себе добрее, заменять самокритику на поддерживающий внутренний диалог.</li>
          <li><strong>Ограничивайте поток негативной информации:</strong> не погружайтесь в токсичный контент и обсуждение своих страданий в бесконечных форумах.</li>
          <li><strong>Осваивайте техники релаксации:</strong> дыхательные упражнения, динамическое расслабление, медитации.</li>
          <li><strong>Не бойтесь обращаться за поддержкой:</strong> раннее обращение к специалисту реально сокращает сроки болезни и предотвращает рецидивы.</li>
        </ul>

        <a name="помощь-близкому-с-депрессией"></a>
        <h2 id="помощь-близкому-с-депрессией">Как поддержать близкого с депрессией</h2>
        <ul>
          <li><strong>Признайте реальность проблемы.</strong> Не говорите: «Соберись!» или «Просто займись делом!». Депрессия — не лень, а болезнь.</li>
          <li><strong>Слушайте и поддерживайте.</strong> Спрашивайте, как человек себя чувствует, что ему нужно. Не давайте непрошеных советов.</li>
          <li><strong>Помогайте с рутиной:</strong> предлагайте помощь в бытовых делах, не требуйте быстрого возвращения к «норме».</li>
          <li><strong>Сопровождайтекспецусту:</strong> иногда вместе пойти на приём проще.</li>
          <li><strong>Следите за тревожными сигналами:</strong> при суицидальных мыслях — срочно вызывайте профессионалов!</li>
          <li><strong>Берегите свои силы:</strong> поддержка выматывает, заботьтесь и о себе тоже.</li>
        </ul>

        <a name="источники"></a>
        <h2 id="источники">Научные источники и публикации</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><strong>World Health Organization (WHO).</strong> Depression. Fact Sheets — Крупнейший международный обзор распространённости и влияния депрессии.</li>
          <li><strong>American Psychiatric Association.</strong> Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5) — Международный стандарт диагностики психических расстройств.</li>
          <li><strong>World Health Organization.</strong> International Classification of Diseases 11th Revision (ICD-11): Mood Disorders — Современная международная классификация депрессивных расстройств.</li>
          <li><strong>Malhi, G. S., Mann, J. J. (2018).</strong> Depression. The Lancet, 392(10161), 2299-2312. doi:10.1016/S0140-6736(18)31948-2 — Свежий и очень полный обзор механизмов, диагностики и лечения депрессии.</li>
          <li><strong>Cuijpers, P., et al. (2021).</strong> Psychological treatment of depression: A meta-analytic database of randomized studies. Molecular Psychiatry, 26, 5166–5177 — Обзор эффективности психотерапии депрессии на основании сотен исследований.</li>
          <li><strong>Nestler, E. J., et al. (2002).</strong> Neurobiology of depression. Neuron, 34(1), 13–25. doi:10.1016/S0896-6273(02)00653-0 — Обзор биологических механизмов депрессии.</li>
          <li><strong>Beck, A. T. (2008).</strong> The evolution of the cognitive model of depression and its neurobiological correlates. American Journal of Psychiatry, 165(8), 969–977 — Классическая и современная когнитивная модель депрессии.</li>
          <li><strong>Schuch, F. B., et al. (2016).</strong> Physical activity and incident depression: a meta-analysis of prospective cohort studies. American Journal of Psychiatry, 175(7), 631–648 — Научные данные о профилактическом эффекте физической активности.</li>
          <li><strong>Neff, K. D., & Germer, C. K. (2013).</strong> A pilot study and randomized controlled trial of the mindful self-compassion program. Journal of Clinical Psychology, 69(1), 28–44 — О важности самосострадания при депрессии.</li>
          <li><strong>Walker, M. (2017).</strong> Why We Sleep: Unlocking the Power of Sleep and Dreams — Книга с анализом роли сна в профилактике и лечении депрессии.</li>
          <li><strong>Emmons, R. A., & McCullough, M. E. (2003).</strong> Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. Journal of Personality and Social Psychology, 84(2), 377–389 — О пользе дневников благодарности при депрессивных состояниях.</li>
          <li><strong>National Institute for Health and Care Excellence (NICE).</strong> Depression in adults: recognition and management. Clinical guideline [CG90] — Британский национальный стандарт диагностики и лечения депрессии.</li>
          <li><strong>Kabat-Zinn, J. (2003).</strong> Mindfulness-based interventions in context: past, present, and future. Clinical Psychology: Science and Practice, 10(2), 144–156 — Научное обоснование практик осознанности (mindfulness) в терапии депрессии.</li>
        </ul>
      </div>
    </ScrollArea>
  );
};

export default ArticlePracticalAspects;
