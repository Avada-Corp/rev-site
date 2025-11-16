import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const tgAddEmailAction = createAction(
  ActionTypes.TG_ADD_EMAIL_BOT,
  props<{ email: string; password: string; chatId: string }>()
);

export const tgAddEmailSuccessAction = createAction(
  ActionTypes.TG_ADD_EMAIL_BOT_SUCCESS
);

export const tgAddEmailFailureAction = createAction(
  ActionTypes.TG_ADD_EMAIL_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
