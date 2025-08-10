
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  userData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ userData, onNext, onBack }) => {
  const { user } = useSupabaseAuth();
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      const email = userData?.email || user?.email;
      if (!email) {
        toast({ title: 'Email не найден', description: 'Укажите корректный email и попробуйте снова.' });
        return;
      }
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      toast({ title: 'Письмо отправлено повторно', description: 'Проверьте почтовый ящик.' });
    } catch (err: any) {
      console.error('Resend email error:', err);
      toast({ title: 'Ошибка отправки', description: err?.message || 'Попробуйте позже.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-emerald-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Проверьте вашу почту</h2>
      <p className="text-gray-600 mb-6">
        Мы отправили письмо с подтверждением на<br />
        <span className="font-medium">{userData?.email || user?.email}</span>
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          Перейдите по ссылке из письма, чтобы подтвердить аккаунт. Это можно сделать и позже в разделе Профиль → Безопасность.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleResend}
          disabled={sending}
        >
          {sending ? 'Отправка…' : 'Отправить письмо повторно'}
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
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
