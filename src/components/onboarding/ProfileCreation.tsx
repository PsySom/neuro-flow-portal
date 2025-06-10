
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ProfileCreationProps {
  onNext: (data: any) => void;
}

const ProfileCreation: React.FC<ProfileCreationProps> = ({ onNext }) => {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    'Анализируем ваши ответы',
    'Настраиваем рекомендации',
    'Подбираем упражнения',
    'Готовим первый день'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onNext({}), 500);
          return 100;
        }
        
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 25);
        if (stepIndex !== currentStep && stepIndex < steps.length) {
          setCurrentStep(stepIndex);
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onNext, currentStep, steps.length]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Создаем ваш персональный план...
      </h2>
      
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <Progress value={progress} className="mb-6" />
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center space-x-2 transition-all duration-300 ${
                index <= currentStep ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-emerald-600' : 'bg-gray-300'
              }`} />
              <span className="text-sm font-medium">{step}</span>
              {index === currentStep && (
                <div className="ml-2 w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
