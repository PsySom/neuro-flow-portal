import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoFieldsProps {
  formData: {
    telegram: string;
    whatsapp: string;
    facebook: string;
  };
  validationErrors: {
    telegram?: string;
    whatsapp?: string;
    facebook?: string;
  };
  onFieldChange: (field: 'telegram' | 'whatsapp' | 'facebook', value: string) => void;
}

const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({
  formData,
  validationErrors,
  onFieldChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram</Label>
        <Input 
          id="telegram" 
          placeholder="@username" 
          value={formData.telegram} 
          onChange={(e) => onFieldChange('telegram', e.target.value)}
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
          value={formData.whatsapp} 
          onChange={(e) => onFieldChange('whatsapp', e.target.value)}
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
          value={formData.facebook} 
          onChange={(e) => onFieldChange('facebook', e.target.value)}
          className={validationErrors.facebook ? 'border-destructive' : ''}
        />
        {validationErrors.facebook && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span>{validationErrors.facebook}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoFields;