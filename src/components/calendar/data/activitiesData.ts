
import { Activity } from '../types';

export const baseActivities: Activity[] = [
  { id: 1, name: 'Сон', emoji: '😴', startTime: '00:00', endTime: '08:00', duration: '8 ч', color: 'bg-indigo-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🛌' },
  { id: 2, name: 'Пробуждение', emoji: '☀️', startTime: '08:00', endTime: '08:30', duration: '30 мин', color: 'bg-yellow-200', importance: 3, completed: true, type: 'восстановление', needEmoji: '⚡' },
  { id: 3, name: 'Зарядка', emoji: '🏃‍♂️', startTime: '08:30', endTime: '09:30', duration: '1 ч', color: 'bg-green-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '💪' },
  { id: 4, name: 'Душ, завтрак, гигиена', emoji: '🚿', startTime: '09:30', endTime: '10:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: true, type: 'восстановление', needEmoji: '🧘' },
  { id: 5, name: 'Утренний дневник', emoji: '📝', startTime: '10:00', endTime: '10:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
  { id: 6, name: 'Дорога на работу', emoji: '🚗', startTime: '10:30', endTime: '11:00', duration: '30 мин', color: 'bg-gray-200', importance: 2, completed: false, type: 'задача' },
  { id: 7, name: 'Работа над проектом', emoji: '💼', startTime: '11:00', endTime: '12:00', duration: '1 ч', color: 'bg-orange-200', importance: 5, completed: false, type: 'задача' },
  { id: 8, name: 'Перерыв на кофе', emoji: '☕', startTime: '12:00', endTime: '12:30', duration: '30 мин', color: 'bg-amber-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌱' },
  { id: 9, name: 'Работа с документами', emoji: '📋', startTime: '13:00', endTime: '14:00', duration: '1 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
  { id: 10, name: 'Обед', emoji: '🍽️', startTime: '14:00', endTime: '14:30', duration: '30 мин', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
  { id: 11, name: 'Прогулка', emoji: '🚶‍♂️', startTime: '14:30', endTime: '15:00', duration: '30 мин', color: 'bg-emerald-200', importance: 3, completed: false, type: 'восстановление', needEmoji: '🌳' },
  { id: 12, name: 'Работа с документами', emoji: '📋', startTime: '15:00', endTime: '17:00', duration: '2 ч', color: 'bg-red-200', importance: 4, completed: false, type: 'задача' },
  { id: 13, name: 'Встреча с другом', emoji: '👥', startTime: '17:00', endTime: '19:00', duration: '2 ч', color: 'bg-pink-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '❤️' },
  { id: 14, name: 'Ужин', emoji: '🍽️', startTime: '19:00', endTime: '20:00', duration: '1 ч', color: 'bg-green-300', importance: 4, completed: false, type: 'восстановление', needEmoji: '🍎' },
  { id: 15, name: 'Просмотр фильма', emoji: '🎬', startTime: '20:00', endTime: '21:30', duration: '1.5 ч', color: 'bg-violet-200', importance: 2, completed: false, type: 'восстановление', needEmoji: '🎭' },
  { id: 16, name: 'Душ, гигиена', emoji: '🚿', startTime: '21:30', endTime: '22:00', duration: '30 мин', color: 'bg-blue-200', importance: 4, completed: false, type: 'восстановление', needEmoji: '🧘' },
  { id: 17, name: 'Заполнение дневника', emoji: '📝', startTime: '22:00', endTime: '22:30', duration: '30 мин', color: 'bg-purple-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🧠' },
  { id: 18, name: 'Подготовка ко сну', emoji: '🛌', startTime: '22:30', endTime: '00:00', duration: '1.5 ч', color: 'bg-slate-200', importance: 5, completed: false, type: 'восстановление', needEmoji: '🌙' },
];
