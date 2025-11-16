import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const updateUserPrivateCommissionAction = createAction(
  ActionTypes.UPDATE_USER_PRIVATE_COMMISSION,
  props<{ email: string; percent: number | null; absolute: number | null }>()
);

export const updateUserPrivateCommissionSuccessAction = createAction(
  ActionTypes.UPDATE_USER_PRIVATE_COMMISSION_SUCCESS
);

export const updateUserPrivateCommissionFailureAction = createAction(
  ActionTypes.UPDATE_USER_PRIVATE_COMMISSION_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
