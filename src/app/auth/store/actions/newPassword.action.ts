import { createAction, props } from '@ngrx/store';

import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const newPasswordAction = createAction(
  ActionTypes.NEW_PASSWORD,
  props<{ password: string; id: string }>()
);

export const newPasswordSuccessAction = createAction(
  ActionTypes.NEW_PASSWORD_SUCCESS
);

export const newPasswordFailureAction = createAction(
  ActionTypes.NEW_PASSWORD_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
