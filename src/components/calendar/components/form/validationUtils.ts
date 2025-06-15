
export interface FormErrors {
  [key: string]: string;
}

export interface ActivityFormData {
  activityName: string;
  activityType: string;
  startTime: string;
  endTime: string;
  selectedDate: Date | undefined;
  priority: number;
  repeatType: string;
  reminder: string;
  selectedColor: string;
  note: string;
  status: string;
}

export const validateActivityForm = (formData: ActivityFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.activityName.trim()) {
    errors.activityName = 'Название активности обязательно для заполнения';
  }

  if (!formData.activityType) {
    errors.activityType = 'Тип активности обязателен для выбора';
  }

  if (!formData.startTime) {
    errors.startTime = 'Время начала обязательно для заполнения';
  }

  if (!formData.endTime) {
    errors.endTime = 'Время окончания обязательно для заполнения';
  }

  if (!formData.selectedDate) {
    errors.selectedDate = 'Дата обязательна для выбора';
  }

  // Проверка логики времени
  if (formData.startTime && formData.endTime) {
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    if (start >= end) {
      errors.timeLogic = 'Время окончания должно быть позже времени начала';
    }
  }

  return errors;
};

export const getEmojiByType = (type: string) => {
  switch (type) {
    case 'восстановление': return '🌱';
    case 'нейтральная': return '⚪';
    case 'смешанная': return '🔄';
    case 'задача': return '📋';
    default: return '📝';
  }
};

export const calculateDuration = (start: string, end: string) => {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const duration = endMinutes - startMinutes;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`;
};
