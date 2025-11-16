import { createAction, props } from '@ngrx/store';

import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ForgetPasswordInterface } from '../../types/forgetPassword.interface';

export const forgetPasswordAction = createAction(
  ActionTypes.FORGET_PASSWORD,
  props<{ request: ForgetPasswordInterface }>()
);

export const forgetPasswordSuccessAction = createAction(
  ActionTypes.FORGET_PASSWORD_SUCCESS
);

export const forgetPasswordFailureAction = createAction(
  ActionTypes.FORGET_PASSWORD_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
