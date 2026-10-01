import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export const parseTime = (value?: string): Dayjs | null => {
  if (!value) return null;
  return dayjs(value, 'HH:mm');
};

export const formatTime = (value: Dayjs | null): string => {
  if (!value || !value.isValid()) return '';
  return value.format('HH:mm');
};
