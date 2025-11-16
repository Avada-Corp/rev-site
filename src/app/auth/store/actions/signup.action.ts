import { createAction, props } from '@ngrx/store';

import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { SignupRequestInterface } from '../../types/SignupRequestInterface';

export const signupAction = createAction(
  ActionTypes.SIGNUP,
  props<{ request: SignupRequestInterface; refId: string | null }>()
);

export const signupSuccessAction = createAction(
  ActionTypes.SIGNUP_SUCCESS,
  props<{ currentUser: CurrentUserInterface; refId: string | null }>()
);

export const signupFailureAction = createAction(
  ActionTypes.SIGNUP_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
