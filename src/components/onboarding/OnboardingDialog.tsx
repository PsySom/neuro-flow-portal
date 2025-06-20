
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RegistrationForm from './RegistrationForm';
import EmailVerification from './EmailVerification';
import WelcomeScreen from './WelcomeScreen';
import BasicInfo from './BasicInfo';
import ChronotypeScreen from './ChronotypeScreen';
import CurrentStateScreen from './CurrentStateScreen';
import ChallengesScreen from './ChallengesScreen';
import ProfessionalHelpScreen from './ProfessionalHelpScreen';
import GoalsScreen from './GoalsScreen';
import PreferencesScreen from './PreferencesScreen';
import ProfileCreation from './ProfileCreation';
import WelcomeComplete from './WelcomeComplete';
import FirstCheckin from './FirstCheckin';

export type OnboardingStep = 
  | 'registration'
  | 'email-verification'
  | 'welcome'
  | 'basic-info'
  | 'chronotype'
  | 'current-state'
  | 'challenges'
  | 'professional-help'
  | 'goals'
  | 'preferences'
  | 'profile-creation'
  | 'welcome-complete'
  | 'first-checkin';

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
    
    // Правильный порядок шагов согласно техническому заданию
    const stepOrder: OnboardingStep[] = [
      'registration',
      'email-verification', 
      'welcome',          // B1: Знакомство и приветствие
      'basic-info',       // B2: Базовые данные
      'chronotype',       // B3: Хронотип и режим дня
      'current-state',    // C1: Оценка текущего самочувствия
      'challenges',       // C2: Основные вызовы и трудности
      'professional-help',// C3: Диагнозы и профессиональная помощь
      'goals',           // D1: Основные цели использования
      'preferences',     // D2: Мотивация и готовность к изменениям
      'profile-creation',// E1: Создание профиля
      'welcome-complete',// E2: Добро пожаловать
      'first-checkin'    // Первая проверка состояния с данными
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
      'chronotype',
      'current-state',
      'challenges',
      'professional-help',
      'goals',
      'preferences',
      'profile-creation',
      'welcome-complete',
      'first-checkin'
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
      case 'chronotype':
        return <ChronotypeScreen {...props} />;
      case 'current-state':
        return <CurrentStateScreen {...props} />;
      case 'challenges':
        return <ChallengesScreen {...props} />;
      case 'professional-help':
        return <ProfessionalHelpScreen {...props} />;
      case 'goals':
        return <GoalsScreen {...props} />;
      case 'preferences':
        return <PreferencesScreen {...props} />;
      case 'profile-creation':
        return <ProfileCreation {...props} />;
      case 'welcome-complete':
        return <WelcomeComplete {...props} />;
      case 'first-checkin':
        return <FirstCheckin {...props} />;
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
