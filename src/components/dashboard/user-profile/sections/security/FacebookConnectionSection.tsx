import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const FacebookConnectionSection: React.FC = () => {
  const { toast } = useToast();

  const connectFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast({ 
        title: 'Не удалось подключить Facebook', 
        description: 'Проверьте настройку провайдера в Supabase.', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <Button 
      type="button" 
      variant="secondary" 
      onClick={connectFacebook} 
      className="mt-2 inline-flex items-center"
    >
      <LinkIcon className="w-4 h-4 mr-2" /> 
      Подключить через Facebook OAuth
    </Button>
  );
};

export default FacebookConnectionSection;