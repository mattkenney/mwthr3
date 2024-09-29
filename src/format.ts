import type { Period } from './types/nws';

export function formatDate(str: string) {
  return new Date(str).toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
  });
}

export function formatName(row: Period) {
  if (row.isDaytime) {
    const when = formatDate(row.startTime);
    return `${row.name} ${when}`;
  }
  return row.name;
}
