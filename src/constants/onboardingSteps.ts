import type { OnboardingStep } from '@/components/onboarding/OnboardingDialog';

export const ONBOARDING_STEP_ORDER: OnboardingStep[] = [
  'registration',      // 1. Регистрация
  'email-verification', // Подтверждение email
  'welcome',           // 2. Знакомство
  'basic-info',        // 3. Базовые данные
  'natural-rhythms',   // 4. Естественные ритмы
  'current-state',     // 5. Текущее состояние
  'challenges',        // 6. Основные вызовы и трудности
  'professional-help', // 7. Диагнозы и профессиональная помощь
  'procrastination',   // 8. Прокрастинация и мотивация
  'anxiety',          // 9. Тревожность и беспокойство
  'social-support',   // 10. Социальная поддержка и связи
  'goals',            // 11. Цели с PsyBalans
  'preferences',      // 12. Предпочтения в работе с приложением
  'personalization',  // 13. Персонализация поддержки
  'confirmation'      // 14. Подтверждение и запуск
];