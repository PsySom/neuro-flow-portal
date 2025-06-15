
export interface Activity {
  id: number;
  name: string;
  emoji: string;
  startTime: string;
  endTime: string;
  duration: string;
  color: string;
  importance: number;
  completed: boolean;
  type: string;
  needEmoji?: string;
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
  timeString: string;
  activities: Activity[];
}
