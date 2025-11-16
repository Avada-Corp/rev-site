import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { AllFullBalance, Bot } from '../types/adminState.interface';

export const getAllFullBalancesAction = createAction(
  ActionTypes.GET_ALL_FULL_BALANCES
);

export const getAllFullBalancesSuccessAction = createAction(
  ActionTypes.GET_ALL_FULL_BALANCES_SUCCESS,
  props<{ balances: AllFullBalance[] }>()
);

export const getAllFullBalancesFailureAction = createAction(
  ActionTypes.GET_ALL_FULL_BALANCES_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
