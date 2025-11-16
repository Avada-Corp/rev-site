import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { CommissionUser } from '../types/adminState.interface';

export const getUserCommissionAction = createAction(
  ActionTypes.GET_USER_COMMISSIONS,
  props<{ to: number }>()
);

export const getUserCommissionSuccessAction = createAction(
  ActionTypes.GET_USER_COMMISSIONS_SUCCESS,
  props<{ commissions: CommissionUser[] }>()
);

export const getUserCommissionFailureAction = createAction(
  ActionTypes.GET_USER_COMMISSIONS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
