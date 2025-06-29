
export const getCurrentDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const formatDate = (date: Date, locale = 'ru-RU'): string => {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
};

export const getUserDisplayName = (user: any): string => {
  return user?.name || user?.email?.split('@')[0] || 'Пользователь';
};

export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentDateString();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};
