export const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'восстановление': return 'border-green-500';
    case 'нейтральная': return 'border-blue-500';
    case 'смешанная': return 'border-yellow-500';
    case 'задача': return 'border-red-500';
    default: return 'border-gray-400';
  }
};

export const getActivityTypeColorHex = (type: string) => {
  switch (type) {
    case 'восстановление': return '#22c55e';
    case 'нейтральная': return '#3b82f6';
    case 'смешанная': return '#eab308';
    case 'задача': return '#ef4444';
    default: return '#9ca3af';
  }
};