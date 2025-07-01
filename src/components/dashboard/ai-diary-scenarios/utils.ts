
import { Question } from './types';

export const formatResponseForChat = (response: any, question: Question): string => {
  if (question.type === 'scale' || question.type === 'emoji-scale') {
    return `Выбрал(а): ${response}`;
  }
  if (question.type === 'multiple-choice') {
    const option = question.options?.find(opt => opt.value === response);
    return option ? `${option.emoji || ''} ${option.label}`.trim() : String(response);
  }
  if (question.type === 'multi-select') {
    if (Array.isArray(response)) {
      const selectedOptions = question.options?.filter(opt => response.includes(opt.value)) || [];
      return selectedOptions.map(opt => `${opt.emoji || ''} ${opt.label}`.trim()).join(', ');
    }
  }
  return String(response);
};
