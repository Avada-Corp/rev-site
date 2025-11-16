import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { User } from '../types/adminState.interface';

export const updateApiPrivateCommissionAction = createAction(
  ActionTypes.UPDATE_API_PRIVATE_COMMISSION,
  props<{ apiKey: string; percent: number | null; absolute: number | null }>()
);

export const updateApiPrivateCommissionSuccessAction = createAction(
  ActionTypes.UPDATE_API_PRIVATE_COMMISSION_SUCCESS
);

export const updateApiPrivateCommissionFailureAction = createAction(
  ActionTypes.UPDATE_API_PRIVATE_COMMISSION_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
