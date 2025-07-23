import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DepressionCareDiary from './DepressionCareDiary';

interface DepressionCareDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const DepressionCareDiaryModal: React.FC<DepressionCareDiaryModalProps> = ({
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
            <span className="text-lg">🌱</span>
            Дневник работы с депрессией
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-0">
            <DepressionCareDiary onComplete={handleDiaryComplete} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DepressionCareDiaryModal;