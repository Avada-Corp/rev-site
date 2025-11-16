import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const setApiStrategyAction = createAction(
  ActionTypes.SET_API_STRATEGY,
  props<{ email: string; apiName: string; strategyId: string }>()
);

export const setApiStrategySuccessAction = createAction(
  ActionTypes.SET_API_STRATEGY_SUCCESS,
  props<{ email: string; apiName: string; strategyId: string }>()
);

export const setApiStrategyFailureAction = createAction(
  ActionTypes.SET_API_STRATEGY_FAILURE,
  props<{ error: any }>()
);
