export const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'восстановление': return 'border-green-300';
    case 'нейтральная': return 'border-blue-300';
    case 'смешанная': return 'border-yellow-300';
    case 'задача': return 'border-red-300';
    default: return 'border-gray-300';
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