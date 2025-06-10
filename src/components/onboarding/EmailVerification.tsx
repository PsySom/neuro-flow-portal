
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailVerificationProps {
  userData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ userData, onNext, onBack }) => {
  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-emerald-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Проверьте вашу почту</h2>
      <p className="text-gray-600 mb-6">
        Мы отправили письмо с подтверждением на<br />
        <span className="font-medium">{userData.email}</span>
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          Проверьте почту и перейдите по ссылке для подтверждения аккаунта
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            // Логика повторной отправки письма
            console.log('Resending email...');
          }}
        >
          Отправить письмо повторно
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onBack}
        >
          Изменить email
        </Button>
        
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
          onClick={() => onNext({})}
        >
          Продолжить (для демо)
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
