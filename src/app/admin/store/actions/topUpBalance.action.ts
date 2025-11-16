import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const topUpBalanceAction = createAction(
  ActionTypes.TOP_UP_BALANCE,
  props<{ email: string; amount: number }>()
);

export const topUpBalanceSuccessAction = createAction(
  ActionTypes.TOP_UP_BALANCE_SUCCESS,
  props<{ email: string; amount: number }>()
);

export const topUpBalanceFailureAction = createAction(
  ActionTypes.TOP_UP_BALANCE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
