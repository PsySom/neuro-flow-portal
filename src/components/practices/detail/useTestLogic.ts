import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface TestResult {
  score: number;
  interpretation: string;
  recommendations?: string;
  maxScore?: number;
}

export const useTestLogic = () => {
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [testResult, setTestResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateBeckDepressionResult = (score: number): TestResult => {
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

    return {
      score,
      interpretation,
      maxScore: 63
    };
  };

  const calculateCognitiveDistortionsResult = (score: number): TestResult => {
    let interpretation = '';
    let recommendations = '';
    
    if (score <= 20) {
      interpretation = 'Когнитивные искажения выражены слабо';
      recommendations = 'Поздравляем! Ваше мышление в целом гибкое и рациональное.';
    } else if (score <= 40) {
      interpretation = 'Искажения встречаются иногда';
      recommendations = 'У вас встречаются отдельные когнитивные искажения, это нормально.';
    } else if (score <= 60) {
      interpretation = 'Искажения выражены умеренно';
      recommendations = 'Некоторые шаблоны мышления могут мешать вам в повседневной жизни.';
    } else {
      interpretation = 'Искажения выражены сильно';
      recommendations = 'У вас выражены стойкие когнитивные искажения.';
    }

    return {
      score,
      interpretation,
      recommendations,
      maxScore: 80
    };
  };

  const calculateWursAdhdResult = (score: number): TestResult => {
    let interpretation = '';
    let recommendations = '';
    
    if (score <= 30) {
      interpretation = 'Симптомы СДВГ выражены слабо или отсутствуют';
      recommendations = 'Признаков СДВГ по шкале не выявлено.';
    } else if (score <= 49) {
      interpretation = 'Возможны отдельные черты СДВГ';
      recommendations = 'У вас есть отдельные черты, схожие с проявлениями СДВГ.';
    } else {
      interpretation = 'Высока вероятность наличия выраженных симптомов СДВГ';
      recommendations = 'Ваши ответы говорят о выраженных симптомах СДВГ.';
    }

    return {
      score,
      interpretation,
      recommendations,
      maxScore: 100
    };
  };

  const calculateYbocsResult = (score: number): TestResult => {
    let interpretation = '';
    let recommendations = '';
    
    if (score <= 7) {
      interpretation = 'ОКР выражено минимально или отсутствует (норма)';
      recommendations = 'Симптомы ОКР отсутствуют или выражены минимально.';
    } else if (score <= 15) {
      interpretation = 'Лёгкая степень ОКР';
      recommendations = 'Лёгкие проявления ОКР, можно попробовать техники самопомощи.';
    } else if (score <= 23) {
      interpretation = 'Умеренная степень ОКР';
      recommendations = 'Симптомы ОКР средней степени, рекомендуется консультация.';
    } else if (score <= 31) {
      interpretation = 'Выраженная степень ОКР';
      recommendations = 'Ярко выраженные симптомы — рекомендована консультация специалиста.';
    } else {
      interpretation = 'Крайне выраженное ОКР';
      recommendations = 'Крайне выраженные симптомы — необходима профессиональная помощь.';
    }

    return {
      score,
      interpretation,
      recommendations,
      maxScore: 40
    };
  };

  const calculatePhq4Result = (score: number, answers: {[key: number]: string}): TestResult => {
    let interpretation = '';
    let recommendations = '';

    // Calculate PHQ-2 (depression) subscale - questions 0 and 1
    const phq2Score = (parseInt(answers[0]?.charAt(0)) || 0) + (parseInt(answers[1]?.charAt(0)) || 0);
    
    // Calculate GAD-2 (anxiety) subscale - questions 2 and 3
    const gad2Score = (parseInt(answers[2]?.charAt(0)) || 0) + (parseInt(answers[3]?.charAt(0)) || 0);

    // Overall PHQ-4 interpretation
    if (score <= 2) {
      interpretation = 'Норма';
      recommendations = `**Общий результат PHQ-4: ${score}/12 - Норма**

🌟 Отличные результаты! Ваши показатели депрессии и тревоги в пределах нормы.

**Подшкалы:**
• Депрессия (PHQ-2): ${phq2Score}/6
• Тревога (GAD-2): ${gad2Score}/6

**Рекомендации:**
✓ Продолжайте заботиться о себе
✓ Поддерживайте здоровый сон и физическую активность  
✓ Повторите самопроверку через 2-4 недели для профилактики

**Атрибуция:** PHQ-4: Kroenke, Spitzer, Williams, Löwe (2009). Free to use.`;
    } else if (score <= 5) {
      interpretation = 'Лёгкая выраженность дистресса';
      recommendations = `**Общий результат PHQ-4: ${score}/12 - Лёгкая выраженность**

⚠️ Лёгкие проявления депрессии или тревоги.

**Подшкалы:**
• Депрессия (PHQ-2): ${phq2Score}/6 ${phq2Score >= 3 ? '(положительный скрининг)' : ''}
• Тревога (GAD-2): ${gad2Score}/6 ${gad2Score >= 3 ? '(положительный скрининг)' : ''}

**Рекомендации:**
${phq2Score >= 3 ? '• Рекомендуется пройти развёрнутый тест PHQ-9 для детализации депрессии\n' : ''}${gad2Score >= 3 ? '• Рекомендуется пройти развёрнутый тест GAD-7 для детализации тревоги\n' : ''}• Изучите техники самопомощи: дыхательные упражнения, релаксация
• Обратите внимание на режим сна и отдыха

**Атрибуция:** PHQ-4: Kroenke, Spitzer, Williams, Löwe (2009). Free to use.`;
    } else if (score <= 8) {
      interpretation = 'Умеренная выраженность дистресса';
      recommendations = `**Общий результат PHQ-4: ${score}/12 - Умеренная выраженность**

🔶 Умеренные проявления депрессии и/или тревоги.

**Подшкалы:**
• Депрессия (PHQ-2): ${phq2Score}/6 ${phq2Score >= 3 ? '(положительный скрининг)' : ''}
• Тревога (GAD-2): ${gad2Score}/6 ${gad2Score >= 3 ? '(положительный скрининг)' : ''}

**Рекомендации:**
• Пройдите развёрнутые тесты PHQ-9 и GAD-7 для детальной оценки
• Применяйте техники самопомощи: дыхание, активность, режим сна
• Рассмотрите консультацию со специалистом, если симптомы сохраняются >2 недель
• Если симптомы мешают повседневной деятельности — обратитесь к врачу

**Атрибуция:** PHQ-4: Kroenke, Spitzer, Williams, Löwe (2009). Free to use.`;
    } else {
      interpretation = 'Тяжёлая выраженность дистресса';
      recommendations = `**Общий результат PHQ-4: ${score}/12 - Тяжёлая выраженность**

🚨 **Внимание!** Выраженные симптомы депрессии и/или тревоги.

**Подшкалы:**
• Депрессия (PHQ-2): ${phq2Score}/6 ${phq2Score >= 3 ? '(положительный скрининг)' : ''}
• Тревога (GAD-2): ${gad2Score}/6 ${gad2Score >= 3 ? '(положительный скрининг)' : ''}

**Настоятельно рекомендуется:**
🏥 **Консультация с клиницистом** (очно или онлайн)
📋 Пройдите развёрнутые тесты PHQ-9 и GAD-7
⚠️ Если есть мысли о самоповреждении — немедленно обратитесь за помощью

**Службы экстренной помощи:**
📞 Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)

**Атрибуция:** PHQ-4: Kroenke, Spitzer, Williams, Löwe (2009). Free to use.`;
    }

    return {
      score,
      interpretation,
      recommendations,
      maxScore: 12
    };
  };

  const calculatePhq9Result = (score: number, answers: {[key: number]: string}): TestResult => {
    let interpretation = '';
    let recommendations = '';

    // Check for suicidal ideation (question 8, index 8)
    const suicidalResponse = parseInt(answers[8]?.charAt(0)) || 0;
    const hasSuicidalThoughts = suicidalResponse > 0;

    // Overall PHQ-9 interpretation
    if (score <= 4) {
      interpretation = 'Отсутствует/минимальная депрессия';
      recommendations = `**Результат PHQ-9: ${score}/27 - Отсутствует/минимальная депрессия**

🌟 Ваши показатели депрессии в пределах нормы или минимальны.

**Рекомендации:**
✓ Поддерживайте здоровый образ жизни
✓ Регулярный сон, физическая активность
✓ Поддерживающие практики и хобби
✓ Повторная самопроверка через 2-4 недели для профилактики

${hasSuicidalThoughts ? `\n🚨 **ВНИМАНИЕ:** Вы указали наличие мыслей о смерти или самоповреждении. Даже при низком общем балле это требует немедленной консультации специалиста.\n\n📞 **Службы экстренной помощи:**\n• Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)\n• Экстренные службы: 112` : ''}

**Атрибуция:** PHQ-9. Разработчики: R.L. Spitzer, J.B.W. Williams, K. Kroenke и соавт.; при поддержке Pfizer.`;
    } else if (score <= 9) {
      interpretation = 'Лёгкая депрессия';
      recommendations = `**Результат PHQ-9: ${score}/27 - Лёгкая депрессия**

⚠️ Признаки лёгкой депрессии.

**Рекомендации:**
• Изучите техники самопомощи и психообразовательные материалы
• Регулярная физическая активность и здоровый режим сна
• Повторите тест через 2-4 недели для мониторинга
• Если симптомы мешают повседневной жизни — обратитесь к психологу

${hasSuicidalThoughts ? `\n🚨 **ВНИМАНИЕ:** Вы указали наличие мыслей о смерти или самоповреждении. Это требует немедленной оценки риска компетентным специалистом.\n\n📞 **Службы экстренной помощи:**\n• Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)\n• Экстренные службы: 112` : ''}

**Атрибуция:** PHQ-9. Разработчики: R.L. Spitzer, J.B.W. Williams, K. Kroenke и соавт.; при поддержке Pfizer.`;
    } else if (score <= 14) {
      interpretation = 'Умеренная депрессия';
      recommendations = `**Результат PHQ-9: ${score}/27 - Умеренная депрессия**

🔶 Умеренные проявления депрессии.

**Рекомендации:**
🏥 **Рекомендуется консультация специалиста** (психолог/врач)
• Разработка совместного плана самопомощи
• Регулярный мониторинг состояния (повтор через 2-4 недели)
• Психотерапевтические техники и практики

${hasSuicidalThoughts ? `\n🚨 **ВНИМАНИЕ:** Вы указали наличие мыслей о смерти или самоповреждении. Это требует немедленной оценки риска компетентным специалистом.\n\n📞 **Службы экстренной помощи:**\n• Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)\n• Экстренные службы: 112` : ''}

**Атрибуция:** PHQ-9. Разработчики: R.L. Spitzer, J.B.W. Williams, K. Kroenke и соавт.; при поддержке Pfizer.`;
    } else if (score <= 19) {
      interpretation = 'Выраженная депрессия';
      recommendations = `**Результат PHQ-9: ${score}/27 - Выраженная депрессия**

🔴 Выраженные симптомы депрессии.

**Настоятельно рекомендуется:**
🏥 **Обязательная консультация специалиста**
• Обсуждение психотерапии и возможного медикаментозного лечения
• Более частый мониторинг состояния
• Профессиональное сопровождение

${hasSuicidalThoughts ? `\n🚨 **ВНИМАНИЕ:** Вы указали наличие мыслей о смерти или самоповреждении. Это требует немедленной оценки риска компетентным специалистом.\n\n📞 **Службы экстренной помощи:**\n• Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)\n• Экстренные службы: 112` : ''}

**Атрибуция:** PHQ-9. Разработчики: R.L. Spitzer, J.B.W. Williams, K. Kroenke и соавт.; при поддержке Pfizer.`;
    } else {
      interpretation = 'Тяжёлая депрессия';
      recommendations = `**Результат PHQ-9: ${score}/27 - Тяжёлая депрессия**

🚨 **КРИТИЧЕСКИ ВАЖНО:** Тяжёлые симптомы депрессии.

**Срочные действия:**
🏥 **СРОЧНО обратитесь к врачу/психиатру**
• Рассмотрение госпитализации при необходимости
• Комплексное лечение (психотерапия + медикаментозное)
• Постоянное наблюдение специалистов

${hasSuicidalThoughts ? `\n🚨 **КРИТИЧЕСКИ ВАЖНО:** Наличие суицидальных мыслей при тяжёлой депрессии требует немедленного вмешательства.\n\n📞 **НЕМЕДЛЕННО обратитесь:**\n• Телефон доверия: 8-800-2000-122 (бесплатно, круглосуточно)\n• Экстренные службы: 112\n• Ближайшее отделение неотложной помощи` : ''}

**Атрибуция:** PHQ-9. Разработчики: R.L. Spitzer, J.B.W. Williams, K. Kroenke и соавт.; при поддержке Pfizer.`;
    }

    return {
      score,
      interpretation,
      recommendations,
      maxScore: 27
    };
  };

  const calculateTestResult = (item: any) => {
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
    let result: TestResult;

    // Calculate score based on test type
    if (item.title.includes("Шкала депрессии Бека")) {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculateBeckDepressionResult(score);
    } else if (item.keys === "PHQ-4") {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer.charAt(0));
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculatePhq4Result(score, answers);
    } else if (item.keys === "PHQ-9") {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer.charAt(0));
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculatePhq9Result(score, answers);
    } else if (item.keys === "cognitive_distortions_scale") {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculateCognitiveDistortionsResult(score);
    } else if (item.keys === "wurs_adhd_scale") {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculateWursAdhdResult(score);
    } else if (item.keys === "y_bocs_scale") {
      Object.values(answers).forEach(answer => {
        const answerIndex = parseInt(answer);
        if (!isNaN(answerIndex)) {
          score += answerIndex;
        }
      });
      result = calculateYbocsResult(score);
    } else {
      // Default calculation for other tests
      Object.values(answers).forEach(answer => {
        if (answer === 'да' || answer === 'часто' || answer === 'согласен') {
          score += 1;
        }
      });
      
      const percentage = (score / totalQuestions) * 100;
      let interpretation = '';
      
      if (percentage >= 70) {
        interpretation = 'Высокий уровень - рекомендуется обратиться к специалисту';
      } else if (percentage >= 40) {
        interpretation = 'Средний уровень - стоит обратить внимание на эту область';
      } else {
        interpretation = 'Низкий уровень - показатели в норме';
      }

      result = {
        score,
        interpretation,
        maxScore: totalQuestions
      };
    }

    // Format result text
    let resultText = '';
    
    if (item.keys === "PHQ-4" || item.keys === "PHQ-9") {
      // For PHQ tests, use the detailed recommendations from the function
      resultText = result.recommendations || result.interpretation;
    } else {
      // Standard formatting for other tests
      resultText = `Результат: ${result.score}`;
      if (result.maxScore) {
        resultText += ` из ${result.maxScore} возможных`;
      }
      resultText += `\n\nИнтерпретация: ${result.interpretation}`;
      
      if (result.recommendations) {
        resultText += `\n\nРекомендации: ${result.recommendations}`;
      }
      
      resultText += '\n\nОбратите внимание: данный тест носит информационный характер и не заменяет профессиональную диагностику.';
    }

    setTestResult(resultText);
    setShowResult(true);
  };

  return {
    answers,
    testResult,
    showResult,
    handleAnswerChange,
    calculateTestResult
  };
};