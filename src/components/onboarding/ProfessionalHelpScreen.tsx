
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ProfessionalHelpScreenProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ProfessionalHelpScreen: React.FC<ProfessionalHelpScreenProps> = ({ onNext, onBack }) => {
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [hasTherapist, setHasTherapist] = useState('');
  const [takesMedication, setTakesMedication] = useState('');

  const diagnosisOptions = [
    'Депрессия',
    'Тревожное расстройство',
    'СДВГ',
    'Биполярное расстройство',
    'РПП (расстройство пищевого поведения)',
    'Другое'
  ];

  const toggleDiagnosis = (diagnosis: string) => {
    setDiagnoses(prev => {
      if (prev.includes(diagnosis)) {
        return prev.filter(d => d !== diagnosis);
      } else {
        return [...prev, diagnosis];
      }
    });
  };

  const handleSubmit = () => {
    onNext({
      diagnoses: diagnoses.length > 0 ? diagnoses : [],
      hasTherapist,
      takesMedication
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Progress value={75} className="mb-4" />
        <p className="text-sm text-gray-500">6 из 8 шагов</p>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Дополнительная информация</h2>
      <p className="text-gray-600 mb-6">
        Эта информация поможет нам лучше адаптировать рекомендации
      </p>
      
      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Есть ли у вас диагностированные психологические состояния?
          </Label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="no-diagnosis"
                checked={diagnoses.length === 0}
                onCheckedChange={(checked) => {
                  if (checked) setDiagnoses([]);
                }}
              />
              <Label htmlFor="no-diagnosis">Нет</Label>
            </div>
            
            {diagnosisOptions.map((diagnosis) => (
              <div key={diagnosis} className="flex items-center space-x-2">
                <Checkbox
                  id={diagnosis}
                  checked={diagnoses.includes(diagnosis)}
                  onCheckedChange={() => toggleDiagnosis(diagnosis)}
                />
                <Label htmlFor={diagnosis}>{diagnosis}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Работаете ли вы с психологом/психиатром?
          </Label>
          <RadioGroup value={hasTherapist} onValueChange={setHasTherapist}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="therapist-no" />
              <Label htmlFor="therapist-no">Нет</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regularly" id="therapist-regularly" />
              <Label htmlFor="therapist-regularly">Да, регулярно</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sometimes" id="therapist-sometimes" />
              <Label htmlFor="therapist-sometimes">Да, иногда</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="planning" id="therapist-planning" />
              <Label htmlFor="therapist-planning">Планирую обратиться</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Принимаете ли вы медикаменты для психического здоровья?
          </Label>
          <RadioGroup value={takesMedication} onValueChange={setTakesMedication}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="medication-no" />
              <Label htmlFor="medication-no">Нет</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="medication-yes" />
              <Label htmlFor="medication-yes">Да</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Важно:</strong> Приложение не заменяет профессиональную помощь специалистов
        </p>
      </div>

      <div className="flex space-x-4 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Назад
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
          disabled={!hasTherapist || !takesMedication}
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalHelpScreen;
