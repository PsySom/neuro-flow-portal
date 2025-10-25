import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">🌱</span>
            Дневник работы с депрессией
          </DialogTitle>
          <DialogDescription className="sr-only">
            Структурированный дневник для работы с депрессией и отслеживания эмоционального состояния
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 max-h-[calc(95vh-100px)]">
          <div className="p-6 pb-8">
            <DepressionCareDiary onComplete={handleDiaryComplete} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DepressionCareDiaryModal;