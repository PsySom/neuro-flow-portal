import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSecurityData } from './security/useSecurityData';
import EmailVerificationSection from './security/EmailVerificationSection';
import ContactInfoFields from './security/ContactInfoFields';
import FacebookConnectionSection from './security/FacebookConnectionSection';
import PasswordChangeSection from './security/PasswordChangeSection';

const SecuritySection: React.FC = () => {
  const { user } = useSupabaseAuth();
  const {
    formData,
    updateField,
    saving,
    validationErrors,
    emailConfirmed,
    saveSecurityData
  } = useSecurityData();

  return (
    <ProfileSection icon={ShieldCheck} title="Безопасность">
      <div className="space-y-4">
        <EmailVerificationSection 
          userEmail={user?.email}
          emailConfirmed={emailConfirmed}
        />

        <Separator />

        <PasswordChangeSection />

        <Separator />

        <ContactInfoFields
          formData={formData}
          validationErrors={validationErrors}
          onFieldChange={updateField}
        />
        
        <FacebookConnectionSection />

        <div>
          <Button onClick={saveSecurityData} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>
    </ProfileSection>
  );
};

export default SecuritySection;
