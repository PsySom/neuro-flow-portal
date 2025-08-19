import { Activity as UiActivity } from '@/components/calendar/types';

// Helper: parse YYYY-MM-DD to Date at local midnight
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date((y ?? 1970), ((m ?? 1) - 1), (d ?? 1), 0, 0, 0, 0);
};

const formatLocalDate = (date: Date): string => date.toLocaleDateString('en-CA');

const daysBetween = (from: Date, to: Date): number => {
  const ms = parseLocalDate(formatLocalDate(to)).getTime() - parseLocalDate(formatLocalDate(from)).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
};

const monthsBetween = (from: Date, to: Date): number => {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
};

/**
 * Expand recurring activities into concrete instances within [startDate, endDate]
 * - Supports: daily, weekly, monthly with .interval
 * - Keeps original activity as-is; clones reuse same id to keep toggle/edit working
 */
export const expandRecurringForRange = (
  activities: UiActivity[],
  startDate: string,
  endDate: string
): UiActivity[] => {
  if (!activities?.length) return [];

  const rangeStart = parseLocalDate(startDate);
  const rangeEnd = parseLocalDate(endDate);

  const result: UiActivity[] = [];

  for (const base of activities) {
    result.push(base);

    const rec = (base as any).recurring as UiActivity['recurring'] | undefined;
    if (!rec || !rec.type) {
      console.log(`Activity ${base.id} (${base.name}) has no recurring info`);
      continue;
    }
    
    console.log(`Expanding recurring activity ${base.id} (${base.name}) of type ${rec.type}`);

    const firstDate = parseLocalDate(base.date);
    // If first occurrence after range end, skip expansion
    if (firstDate > rangeEnd) continue;

    const from = rangeStart > firstDate ? rangeStart : firstDate;

    // Iterate dates in range and generate matches according to rule
    for (let d = new Date(from); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      const isOriginal = d.getTime() === firstDate.getTime();
      if (isOriginal) continue; // base already included

      let matches = false;
      const interval = Math.max(1, rec.interval ?? 1);

      if (rec.type === 'daily') {
        const diff = daysBetween(firstDate, d);
        matches = diff >= 0 && diff % interval === 0;
      } else if (rec.type === 'weekly') {
        const diff = daysBetween(firstDate, d);
        matches = diff >= 0 && d.getDay() === firstDate.getDay() && Math.floor(diff / 7) % interval === 0;
      } else if (rec.type === 'monthly') {
        const months = monthsBetween(firstDate, d);
        matches = months >= 0 && months % interval === 0 && d.getDate() === firstDate.getDate();
      }

      if (!matches) continue;

      const dateStr = formatLocalDate(d);

      // Clone for this day; reuse id to keep actions working, but update date
      const clone: UiActivity = {
        ...base,
        date: dateStr,
        // Generate unique ID for clone to prevent conflicts
        id: `${base.id}_recurring_${dateStr}`,
        // Mark as recurring clone for identification
        recurring: {
          ...rec,
          originalId: typeof base.id === 'number' ? base.id : parseInt(base.id.toString()),
          isClone: true
        }
      } as UiActivity;

      result.push(clone);
    }
  }

  return result;
};
