export * from './autorestart';
export * from './coins';
export * from './cycle_up';
export * from './first_order_indent';
export * from './logarithmic_factor';
export * from './profit';
export * from './rate_cover';
export * from './rate_mode';
export * from './sleep_after_done';
export * from './sleep_before_cancel';
export * from './sleep_before_up';
export * from './positionmode';
export * from './algos';
export * from './sf__id_op';
export * from './filter_types';
export * from './filter_periods';

export interface Select {
  name: string;
  value: string | null;
}

export type CommissionType = 'weekly' | 'monthly';
