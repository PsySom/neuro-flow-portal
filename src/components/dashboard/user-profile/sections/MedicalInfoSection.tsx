import React from 'react';
import { Shield } from 'lucide-react';
import ProfileSection from '../ProfileSection';
import ProfileField from '../ProfileField';
import ProfileBadgeList from '../ProfileBadgeList';
import { UserProfileData } from '../types';

interface MedicalInfoSectionProps {
  data: UserProfileData;
}

const MedicalInfoSection: React.FC<MedicalInfoSectionProps> = ({ data }) => {
  return (
    <ProfileSection icon={Shield} title="Медицинская информация">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
        <ProfileBadgeList 
          label="Диагнозы" 
          items={data.medicalInfo?.diagnosed_conditions || data.medicalInfo?.diagnosedConditions}
          variant="secondary"
        />
        <ProfileField 
          label="Работа с терапевтом" 
          value={data.medicalInfo?.working_with_therapist || data.medicalInfo?.workingWithTherapist} 
        />
        <ProfileField 
          label="Прием медикаментов" 
          value={(data.medicalInfo?.taking_medication ?? data.medicalInfo?.takingMedication) ? 'Да' : 'Нет'} 
        />
      </div>
    </ProfileSection>
  );
};

export default MedicalInfoSection;