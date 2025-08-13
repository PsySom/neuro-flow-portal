import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { validateTelegramHandle, validateWhatsAppNumber, validateFacebookUrl, sanitizeInput } from '@/utils/securityValidation';
import { securityLogger } from '@/utils/securityLogger';

interface SecurityFormData {
  telegram: string;
  whatsapp: string;
  facebook: string;
}

interface ValidationErrors {
  telegram?: string;
  whatsapp?: string;
  facebook?: string;
}

export const useSecurityData = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SecurityFormData>({
    telegram: '',
    whatsapp: '',
    facebook: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const emailConfirmed = !!user?.email_confirmed_at;

  useEffect(() => {
    const loadSecurityData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('telegram_handle, whatsapp_number, facebook_url')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            telegram: data.telegram_handle || '',
            whatsapp: data.whatsapp_number || '',
            facebook: data.facebook_url || ''
          });
        }
      } catch (e: any) {
        console.error('Load security data error:', e);
      }
    };

    loadSecurityData();
  }, [user?.id]);

  const validateFields = () => {
    const errors: ValidationErrors = {};
    
    const telegramValidation = validateTelegramHandle(formData.telegram);
    if (!telegramValidation.isValid) {
      errors.telegram = telegramValidation.message;
    }
    
    const whatsappValidation = validateWhatsAppNumber(formData.whatsapp);
    if (!whatsappValidation.isValid) {
      errors.whatsapp = whatsappValidation.message;
    }
    
    const facebookValidation = validateFacebookUrl(formData.facebook);
    if (!facebookValidation.isValid) {
      errors.facebook = facebookValidation.message;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateField = (field: keyof SecurityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const saveSecurityData = async () => {
    if (!user?.id) return;
    
    if (!validateFields()) {
      toast({ 
        title: 'Ошибка валидации', 
        description: 'Исправьте ошибки в форме.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setSaving(true);
    try {
      const sanitizedData = {
        telegram_handle: formData.telegram ? sanitizeInput(formData.telegram) : null,
        whatsapp_number: formData.whatsapp ? sanitizeInput(formData.whatsapp) : null,
        facebook_url: formData.facebook ? sanitizeInput(formData.facebook) : null,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Log security update
      securityLogger.logProfileUpdate(
        user.id, 
        Object.keys(sanitizedData).filter(key => sanitizedData[key as keyof typeof sanitizedData] !== null), 
        { fields: Object.keys(sanitizedData) }
      );
      
      toast({ title: 'Сохранено', description: 'Настройки безопасности обновлены.' });
    } catch (e: any) {
      toast({ 
        title: 'Ошибка', 
        description: e.message || 'Не удалось сохранить данные', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    updateField,
    saving,
    validationErrors,
    emailConfirmed,
    saveSecurityData
  };
};