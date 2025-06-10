
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: (data: any) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="p-8 text-center">
      <div className="mb-6">
        <Progress value={12.5} className="mb-4" />
        <p className="text-sm text-gray-500">1 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Привет! Давайте знакомиться</h2>
      
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-white" />
      </div>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        Мы создадим персональный план заботы о вашем благополучии.
        <br />
        Это займет 3-5 минут
      </p>
      
      <Button 
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        onClick={() => onNext({})}
      >
        Начать
      </Button>
    </div>
  );
};

export default WelcomeScreen;
