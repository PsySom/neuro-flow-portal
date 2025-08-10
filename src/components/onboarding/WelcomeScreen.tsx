
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/hooks/use-toast';

interface WelcomeScreenProps {
  onNext: (data: any) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const { user } = useSupabaseAuth();
  const [sending, setSending] = useState(false);

  const handleSendNow = async () => {
    setSending(true);
    try {
      const email = user?.email;
      if (!email) {
        toast({ title: 'Email не найден', description: 'Вы можете подтвердить почту позже в Профиль → Безопасность.' });
      } else {
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        if (error) throw error;
        toast({ title: 'Письмо отправлено', description: 'Проверьте почту и перейдите по ссылке.' });
      }
      onNext({ email_verification_requested: true });
    } catch (err: any) {
      console.error('Resend email error:', err);
      toast({ title: 'Не удалось отправить письмо', description: err?.message || 'Попробуйте позже.' });
      onNext({ email_verification_requested: false });
    } finally {
      setSending(false);
    }
  };

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
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Мы создадим персональный план заботы о вашем благополучии.
        <br />
        Это займет 3-5 минут
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          Подтверждение email не обязательно для входа. Хотите отправить письмо сейчас?
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline"
          className="w-full"
          onClick={handleSendNow}
          disabled={sending}
        >
          {sending ? 'Отправка…' : 'Отправить подтверждение сейчас'}
        </Button>
        
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          onClick={() => onNext({ email_verification_requested: false })}
        >
          Продолжить без подтверждения
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
