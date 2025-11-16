import { createAction, props } from '@ngrx/store';

export const updateDefaultFreezePeriodAction = createAction(
  '[Admin] Update Default Freeze Period',
  props<{ freezePeriod: number | null }>()
);

export const updateDefaultFreezePeriodSuccessAction = createAction(
  '[Admin] Update Default Freeze Period Success',
  props<{ freezePeriod: number | null }>()
);

export const updateDefaultFreezePeriodFailureAction = createAction(
  '[Admin] Update Default Freeze Period Failure',
  props<{ error: any }>()
);

export const getDefaultFreezePeriodAction = createAction(
  '[Admin] Get Default Freeze Period'
);

export const getDefaultFreezePeriodSuccessAction = createAction(
  '[Admin] Get Default Freeze Period Success',
  props<{ freezePeriod: number | null }>()
);

export const getDefaultFreezePeriodFailureAction = createAction(
  '[Admin] Get Default Freeze Period Failure',
  props<{ error: any }>()
);
