
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import BreathingAnimationDialog from './BreathingAnimationDialog';
import PracticeInfo from './detail/PracticeInfo';
import PracticeActions from './detail/PracticeActions';
import TestSection from './detail/TestSection';
import { useTestLogic } from './detail/useTestLogic';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: string;
  level: string;
  participants: string;
  category: string;
  therapyMethods: string[];
  problems: string[];
  objects: string[];
  tags: string[];
  color: string;
  instructions?: string;
  questions?: string[] | { question: string; options: string[]; }[];
  keys?: string;
  responseFormat?: string;
}

interface PracticeDetailModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PracticeDetailModal: React.FC<PracticeDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [showBreathingAnimation, setShowBreathingAnimation] = useState(false);
  const {
    answers,
    testResult,
    showResult,
    handleAnswerChange,
    calculateTestResult
  } = useTestLogic();

  if (!item) return null;

  const handleTestResult = () => {
    calculateTestResult(item);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <PracticeInfo item={item} />

          {item.type === 'tests' && item.questions ? (
            <TestSection
              item={item}
              answers={answers}
              testResult={testResult}
              showResult={showResult}
              onAnswerChange={handleAnswerChange}
              onCalculateResult={handleTestResult}
            />
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Инструкция:</h4>
                <p className="text-gray-700">
                  {item.instructions || `Следуйте указаниям ниже для выполнения упражнения "${item.title}".`}
                </p>
              </div>
            </div>
          )}

          <Separator />

          <PracticeActions
            itemTitle={item.title}
            onBreathingStart={() => setShowBreathingAnimation(true)}
            showBreathingButton={item.title.includes('Дыхание 4-7-8') || item.title.includes('Дыхательная техника 4-7-8')}
          />
        </div>
      </DialogContent>
      
      <BreathingAnimationDialog
        open={showBreathingAnimation}
        onOpenChange={setShowBreathingAnimation}
      />
    </Dialog>
  );
};

export default PracticeDetailModal;
