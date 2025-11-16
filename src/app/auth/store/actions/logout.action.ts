import { createAction, props } from '@ngrx/store';

import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const logoutAction = createAction(
  ActionTypes.LOGOUT
);
export const logoutSuccessAction = createAction(
  ActionTypes.LOGOUT_SUCCESS_ACTION
);
export const logoutFailureAction = createAction(
  ActionTypes.LOGOUT_FAILURE_ACTION,
  props<{ errors: BackendErrorsInterface }>()
);
