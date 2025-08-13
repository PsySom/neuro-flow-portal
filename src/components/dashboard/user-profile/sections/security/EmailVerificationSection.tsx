import React from 'react';
import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationSectionProps {
  userEmail?: string;
  emailConfirmed: boolean;
}

const EmailVerificationSection: React.FC<EmailVerificationSectionProps> = ({
  userEmail,
  emailConfirmed
}) => {
  const { toast } = useToast();

  const resendEmail = async () => {
    if (!userEmail) return;
    
    try {
      const { error } = await supabase.auth.resend({ 
        type: 'signup', 
        email: userEmail 
      });
      
      if (error) throw error;
      
      toast({ 
        title: 'Письмо отправлено', 
        description: 'Проверьте почту, чтобы подтвердить адрес.' 
      });
    } catch (e: any) {
      toast({ 
        title: 'Ошибка', 
        description: e.message || 'Не удалось отправить письмо', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <Mail className="w-4 h-4" />
        <span>Email: {userEmail || '—'}</span>
        <Badge variant={emailConfirmed ? 'secondary' : 'destructive'}>
          {emailConfirmed ? 'подтверждён' : 'не подтверждён'}
        </Badge>
      </div>
      {!emailConfirmed && (
        <Button onClick={resendEmail} variant="outline" className="mt-2">
          Отправить письмо ещё раз
        </Button>
      )}
    </div>
  );
};

export default EmailVerificationSection;