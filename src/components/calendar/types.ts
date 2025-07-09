
export interface Activity {
  id: number | string;
  name: string;
  emoji: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  color: string;
  importance: number;
  completed: boolean;
  type: string;
  needEmoji?: string;
  reminder?: string;
  note?: string;
  date: string;
  recurring?: {
    originalId: number;
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    occurrenceNumber: number;
  };
}

export interface ActivityLayout {
  activity: Activity;
  top: number;
  height: number;
  left: number;
  width: number;
  column: number;
  totalColumns: number;
}

export interface TimeMarker {
  hour: number;
  time: string;
  position: number;
}
