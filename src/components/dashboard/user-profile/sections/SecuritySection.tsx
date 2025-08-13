import React, { useEffect, useState } from 'react';
import { ShieldCheck, Mail, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateTelegramHandle, validateWhatsAppNumber, validateFacebookUrl, sanitizeInput } from '@/utils/securityValidation';
import { securityLogger } from '@/utils/securityLogger';

const SecuritySection: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    telegram?: string;
    whatsapp?: string;
    facebook?: string;
  }>({});

  const emailConfirmed = !!user?.email_confirmed_at;

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('telegram_handle, whatsapp_number, facebook_url')
          .eq('id', user?.id || '')
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setTelegram(data.telegram_handle || '');
          setWhatsapp(data.whatsapp_number || '');
          setFacebook(data.facebook_url || '');
        }
      } catch (e: any) {
        console.error('Load security data error:', e);
      }
    };
    if (user?.id) load();
  }, [user?.id]);

  const validateFields = () => {
    const errors: typeof validationErrors = {};
    
    const telegramValidation = validateTelegramHandle(telegram);
    if (!telegramValidation.isValid) {
      errors.telegram = telegramValidation.message;
    }
    
    const whatsappValidation = validateWhatsAppNumber(whatsapp);
    if (!whatsappValidation.isValid) {
      errors.whatsapp = whatsappValidation.message;
    }
    
    const facebookValidation = validateFacebookUrl(facebook);
    if (!facebookValidation.isValid) {
      errors.facebook = facebookValidation.message;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    if (!validateFields()) {
      toast({ title: 'Ошибка валидации', description: 'Исправьте ошибки в форме.', variant: 'destructive' });
      return;
    }
    
    setSaving(true);
    try {
      // Sanitize inputs before saving
      const sanitizedData = {
        telegram_handle: telegram ? sanitizeInput(telegram) : null,
        whatsapp_number: whatsapp ? sanitizeInput(whatsapp) : null,
        facebook_url: facebook ? sanitizeInput(facebook) : null,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id);
      if (error) throw error;
      
      // Log security update
      securityLogger.logProfileUpdate(user.id, Object.keys(sanitizedData).filter(key => sanitizedData[key as keyof typeof sanitizedData] !== null), {
        fields: Object.keys(sanitizedData)
      });
      
      toast({ title: 'Сохранено', description: 'Настройки безопасности обновлены.' });
    } catch (e: any) {
      toast({ title: 'Ошибка', description: e.message || 'Не удалось сохранить данные', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const resendEmail = async () => {
    if (!user?.email) return;
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
      if (error) throw error;
      toast({ title: 'Письмо отправлено', description: 'Проверьте почту, чтобы подтвердить адрес.' });
    } catch (e: any) {
      toast({ title: 'Ошибка', description: e.message || 'Не удалось отправить письмо', variant: 'destructive' });
    }
  };

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
      toast({ title: 'Не удалось подключить Facebook', description: 'Проверьте настройку провайдера в Supabase.', variant: 'destructive' });
    }
  };

  return (
    <ProfileSection icon={ShieldCheck} title="Безопасность">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            <span>Email: {user?.email || '—'}</span>
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

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input 
              id="telegram" 
              placeholder="@username" 
              value={telegram} 
              onChange={(e) => {
                setTelegram(e.target.value);
                if (validationErrors.telegram) {
                  setValidationErrors(prev => ({ ...prev, telegram: undefined }));
                }
              }}
              className={validationErrors.telegram ? 'border-destructive' : ''}
            />
            {validationErrors.telegram && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                <span>{validationErrors.telegram}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              placeholder="+7 900 000-00-00" 
              value={whatsapp} 
              onChange={(e) => {
                setWhatsapp(e.target.value);
                if (validationErrors.whatsapp) {
                  setValidationErrors(prev => ({ ...prev, whatsapp: undefined }));
                }
              }}
              className={validationErrors.whatsapp ? 'border-destructive' : ''}
            />
            {validationErrors.whatsapp && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                <span>{validationErrors.whatsapp}</span>
              </div>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input 
              id="facebook" 
              placeholder="https://facebook.com/your.profile" 
              value={facebook} 
              onChange={(e) => {
                setFacebook(e.target.value);
                if (validationErrors.facebook) {
                  setValidationErrors(prev => ({ ...prev, facebook: undefined }));
                }
              }}
              className={validationErrors.facebook ? 'border-destructive' : ''}
            />
            {validationErrors.facebook && (
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="h-3 w-3" />
                <span>{validationErrors.facebook}</span>
              </div>
            )}
            <Button type="button" variant="secondary" onClick={connectFacebook} className="mt-2 inline-flex items-center">
              <LinkIcon className="w-4 h-4 mr-2" /> Подключить через Facebook OAuth
            </Button>
          </div>
        </div>

        <div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </ProfileSection>
  );
};

export default SecuritySection;
