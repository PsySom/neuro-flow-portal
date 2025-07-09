export const getActivityTypeId = (type: string): number => {
  switch (type) {
    case 'задача': return 1;
    case 'восстановление': return 2;
    case 'нейтральная': return 3;
    case 'смешанная': return 4;
    default: return 1;
  }
};