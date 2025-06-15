
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ActivityStatusProps {
  status: string;
  setStatus: (value: string) => void;
}

const ActivityStatus: React.FC<ActivityStatusProps> = ({
  status,
  setStatus
}) => {
  return (
    <div className="space-y-2">
      <Label>Статус</Label>
      <div className="flex space-x-2">
        <Button
          variant={status === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatus('completed')}
        >
          Выполнено
        </Button>
        <Button
          variant={status === 'in-progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatus('in-progress')}
        >
          В процессе
        </Button>
        <Button
          variant={status === 'deleted' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setStatus('deleted')}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};

export default ActivityStatus;
