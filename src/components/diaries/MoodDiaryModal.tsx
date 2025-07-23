import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import MoodDiary from './MoodDiary';

interface MoodDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const MoodDiaryModal: React.FC<MoodDiaryModalProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const handleDiaryComplete = () => {
    onComplete?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">😊</span>
            Дневник настроения
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[calc(95vh-100px)]">
          <div className="p-6 pb-8">
            <MoodDiary onComplete={handleDiaryComplete} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MoodDiaryModal;