
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { onboardingService } from '@/services/onboarding.service';
import { useOnboardingSubmission } from '@/hooks/useOnboardingSubmission';
import { ONBOARDING_STEP_ORDER } from '@/constants/onboardingSteps';
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
  const { isLoading, submitStepData, completeOnboarding } = useOnboardingSubmission();

  useEffect(() => {
    if (isOpen && currentStep === 'welcome') {
      // Запускаем процесс онбординга после регистрации
      console.log('🚀 Starting onboarding process...');
      onboardingService.startOnboarding()
        .then(() => console.log('✅ Onboarding started successfully'))
        .catch((error) => {
          console.error('❌ Failed to start onboarding:', error);
          console.error('Error details:', error.response?.data);
        });
    }
  }, [isOpen, currentStep]);

  const handleStepComplete = async (stepData: any) => {
    const newUserData = { ...userData, ...stepData };
    setUserData(newUserData);

    // Отправляем данные на бэкенд
    const result = await submitStepData(currentStep, stepData);
    
    if (!result.success) {
      return; // Останавливаемся при ошибке
    }
    
    const currentIndex = ONBOARDING_STEP_ORDER.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEP_ORDER.length - 1) {
      setCurrentStep(ONBOARDING_STEP_ORDER[currentIndex + 1]);
    } else {
      // Завершаем онбординг
      const result = await completeOnboarding();
      if (result.success) {
        onClose();
      }
    }
  };

  const handleBack = () => {
    const currentIndex = ONBOARDING_STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEP_ORDER[currentIndex - 1]);
    }
  };

  const renderCurrentStep = () => {
    const props = {
      userData,
      onNext: handleStepComplete,
      onBack: handleBack,
      canGoBack: currentStep !== 'registration',
      isLoading
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
