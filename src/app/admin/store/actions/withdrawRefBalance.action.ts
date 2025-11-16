import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const withdrawRefBalanceAction = createAction(
  ActionTypes.WITHDRAW_REF_BALANCE,
  props<{ email: string; amount: number }>()
);

export const withdrawRefBalanceSuccessAction = createAction(
  ActionTypes.WITHDRAW_REF_BALANCE_SUCCESS,
  props<{ email: string; amount: number }>()
);

export const withdrawRefBalanceFailureAction = createAction(
  ActionTypes.WITHDRAW_REF_BALANCE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
