import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const copyStrategySettingsAction = createAction(
  ActionTypes.COPY_STRATEGY_SETTINGS,
  props<{ fromStrategyId: string; toStrategyId: string }>()
);

export const copyStrategySettingsSuccessAction = createAction(
  ActionTypes.COPY_STRATEGY_SETTINGS_SUCCESS,
  props<{ bots: any[] }>()
);

export const copyStrategySettingsFailureAction = createAction(
  ActionTypes.COPY_STRATEGY_SETTINGS_FAILURE
);
