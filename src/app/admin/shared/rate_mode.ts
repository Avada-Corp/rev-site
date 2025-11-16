import { Select } from '.';

export const rate_mode: Select[] = [
  { name: '—Выберите—', value: null },
  { name: 'Средняя', value: 'avg' },
  { name: 'Продажа', value: 'sell' },
  { name: 'Покупка', value: 'buy' },
];
