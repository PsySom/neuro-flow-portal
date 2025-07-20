import { useState, useEffect } from 'react';
import { onboardingService } from '@/services/onboarding.service';
import type { OnboardingOptions } from '@/types/onboarding.types';

export const useOnboardingOptions = () => {
  const [options, setOptions] = useState<OnboardingOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        console.log('🔄 Loading onboarding options from backend...');
        const data = await onboardingService.getAllOptions();
        setOptions(data);
        console.log('✅ Onboarding options loaded successfully:', data);
      } catch (err: any) {
        console.error('❌ Failed to load onboarding options:', err);
        setError(err.message || 'Failed to load options');
        
        // Fallback to static options if backend fails
        setOptions({
          goals: [
            'Справиться с тревогой',
            'Улучшить настроение',
            'Повысить самооценку',
            'Развить устойчивость к стрессу',
            'Улучшить сон',
            'Повысить мотивацию',
            'Развить осознанность'
          ],
          challenges: [
            'Тревога и беспокойство',
            'Стресс и напряжение',
            'Прокрастинация и откладывание дел',
            'Низкая самооценка',
            'Проблемы со сном',
            'Недостаток энергии',
            'Трудности с концентрацией',
            'Перепады настроения',
            'Одиночество',
            'Выгорание',
            'Проблемы в отношениях'
          ],
          conditions: [
            'Депрессия',
            'Тревожное расстройство',
            'ОКР',
            'ПТСР',
            'Биполярное расстройство',
            'СДВГ',
            'Расстройства пищевого поведения'
          ],
          coping_strategies: [
            'Глубокое дыхание',
            'Медитация',
            'Физические упражнения',
            'Прогулки на природе',
            'Общение с друзьями',
            'Слушание музыки',
            'Творчество'
          ],
          procrastination_barriers: [
            'Страх неудачи',
            'Перфекционизм',
            'Недостаток мотивации',
            'Переутомление',
            'Неясность задач',
            'Отвлекающие факторы'
          ],
          anxiety_triggers: [
            'Социальные ситуации',
            'Работа/учеба',
            'Здоровье',
            'Будущее',
            'Финансы',
            'Отношения',
            'Неопределенность'
          ],
          anxiety_manifestations: [
            'Учащенное сердцебиение',
            'Потливость',
            'Дрожь',
            'Одышка',
            'Головокружение',
            'Тошнота',
            'Мышечное напряжение'
          ],
          support_sources: [
            'Семья',
            'Друзья',
            'Коллеги',
            'Психолог/терапевт',
            'Группы поддержки',
            'Онлайн-сообщества'
          ],
          support_barriers: [
            'Стыд/стигма',
            'Финансовые ограничения',
            'Недоступность услуг',
            'Недоверие к специалистам',
            'Языковые барьеры',
            'Географическая удаленность'
          ],
          loneliness_situations: [
            'В компании людей',
            'Дома в одиночестве',
            'На работе/учебе',
            'В социальных сетях',
            'На мероприятиях',
            'По выходным'
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  return { options, isLoading, error };
};