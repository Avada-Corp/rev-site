import { createAction, props } from '@ngrx/store';
import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const tgLoginAction = createAction(
  ActionTypes.TG_LOGIN,
  props<{ chatId: string; refId: string | null }>()
);

export const tgLoginSuccessAction = createAction(
  ActionTypes.TG_LOGIN_SUCCESS,
  props<{
    chatId: string;
    email: string;
    refId: string | null;
    isCreatedAcc: boolean;
  }>()
);

export const tgLoginFailureAction = createAction(
  ActionTypes.TG_LOGIN_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
