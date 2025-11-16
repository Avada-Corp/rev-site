import { Select } from '.';

export const filter_periods: Select[] = [
  { name: '—Выберите—', value: null },
  { name: '1 минута', value: '1m' },
  { name: '5 минут', value: '5m' },
  { name: '15 минут', value: '15m' },
  { name: '30 минут', value: '30m' },
  { name: '1 час', value: '1h' },
  { name: '2 часа', value: '2h' },
  { name: '4 часа', value: '4h' },
  { name: '1 день', value: '1d' },
];
