import dayjs from 'dayjs';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, format: string = 'MMMM D, YYYY'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('MMMM D, YYYY, HH:mm');
}

export function formatDateShort(date: string | Date): string {
  return dayjs(date).format('DD.MM.YYYY');
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const s = dayjs(start);
  const e = dayjs(end);
  if (s.isSame(e, 'day')) {
    return `${s.format('D MMMM YYYY')}, ${s.format('HH:mm')} — ${e.format('HH:mm')}`;
  }
  return `${s.format('D MMM YYYY, HH:mm')} — ${e.format('D MMM YYYY, HH:mm')}`;
}
