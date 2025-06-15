
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateActivityTab from './CreateActivityTab';
import EvaluateActivityTab from './EvaluateActivityTab';
import InDevelopmentTab from './InDevelopmentTab';

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateActivityDialog: React.FC<CreateActivityDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Управление активностью
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Создать/редактировать активность</TabsTrigger>
            <TabsTrigger value="evaluate">Оценить активность</TabsTrigger>
            <TabsTrigger value="development">В разработке</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <CreateActivityTab />
          </TabsContent>

          <TabsContent value="evaluate" className="mt-6">
            <EvaluateActivityTab />
          </TabsContent>

          <TabsContent value="development" className="mt-6">
            <InDevelopmentTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActivityDialog;
