import { Select } from '.';

export const filter_types: Select[] = [
  { name: '—Выберите—', value: null },
  { name: 'RSI индикатор 15мин периоды', value: 'rsi' },
  { name: 'Полосы Боллинджера (Цена под нижней линией)', value: 'bb_l' },
  { name: 'Полосы Боллинджера (Цена над верхней линией)', value: 'bb_u' },
];
