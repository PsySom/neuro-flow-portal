
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RegistrationForm from './RegistrationForm';
import EmailVerification from './EmailVerification';
import WelcomeScreen from './WelcomeScreen';
import BasicInfo from './BasicInfo';
import NaturalRhythmsScreen from './NaturalRhythmsScreen';
import CurrentStateScreen from './CurrentStateScreen';
import ChallengesScreen from './ChallengesScreen';
import ProfessionalHelpScreen from './ProfessionalHelpScreen';
import ProcrastinationScreen from './ProcrastinationScreen';
import AnxietyScreen from './AnxietyScreen';
import SocialSupportScreen from './SocialSupportScreen';
import GoalsScreen from './GoalsScreen';
import PreferencesScreen from './PreferencesScreen';
import PersonalizationScreen from './PersonalizationScreen';
import ConfirmationScreen from './ConfirmationScreen';

export type OnboardingStep = 
  | 'registration'
  | 'email-verification'
  | 'welcome'
  | 'basic-info'
  | 'natural-rhythms'
  | 'current-state'
  | 'challenges'
  | 'professional-help'
  | 'procrastination'
  | 'anxiety'
  | 'social-support'
  | 'goals'
  | 'preferences'
  | 'personalization'
  | 'confirmation';

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('registration');
  const [userData, setUserData] = useState<any>({});

  const handleStepComplete = (stepData: any) => {
    const newUserData = { ...userData, ...stepData };
    setUserData(newUserData);
    
    // Новый порядок шагов согласно обновленному техническому заданию
    const stepOrder: OnboardingStep[] = [
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
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    const stepOrder: OnboardingStep[] = [
      'registration',
      'email-verification',
      'welcome',
      'basic-info',
      'natural-rhythms',
      'current-state',
      'challenges',
      'professional-help',
      'procrastination',
      'anxiety',
      'social-support',
      'goals',
      'preferences',
      'personalization',
      'confirmation'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const renderCurrentStep = () => {
    const props = {
      userData,
      onNext: handleStepComplete,
      onBack: handleBack,
      canGoBack: currentStep !== 'registration'
    };

    switch (currentStep) {
      case 'registration':
        return <RegistrationForm {...props} />;
      case 'email-verification':
        return <EmailVerification {...props} />;
      case 'welcome':
        return <WelcomeScreen {...props} />;
      case 'basic-info':
        return <BasicInfo {...props} />;
      case 'natural-rhythms':
        return <NaturalRhythmsScreen {...props} />;
      case 'current-state':
        return <CurrentStateScreen {...props} />;
      case 'challenges':
        return <ChallengesScreen {...props} />;
      case 'professional-help':
        return <ProfessionalHelpScreen {...props} />;
      case 'procrastination':
        return <ProcrastinationScreen {...props} />;
      case 'anxiety':
        return <AnxietyScreen {...props} />;
      case 'social-support':
        return <SocialSupportScreen {...props} />;
      case 'goals':
        return <GoalsScreen {...props} />;
      case 'preferences':
        return <PreferencesScreen {...props} />;
      case 'personalization':
        return <PersonalizationScreen {...props} />;
      case 'confirmation':
        return <ConfirmationScreen {...props} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
