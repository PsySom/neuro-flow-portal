import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import OCDDiary from './OCDDiary';

interface OCDDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const OCDDiaryModal: React.FC<OCDDiaryModalProps> = ({
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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            Дневник работы с ОКР
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-0">
            <OCDDiary onComplete={handleDiaryComplete} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OCDDiaryModal;