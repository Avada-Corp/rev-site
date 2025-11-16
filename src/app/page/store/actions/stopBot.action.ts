import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const stopBotAction = createAction(
  ActionTypes.STOP_BOT,
  props<{ email: string; apiId: string }>()
);

export const stopBotSuccessAction = createAction(
  ActionTypes.STOP_BOT_SUCCESS,
  props<{ messages?: string[] }>()
);

export const stopBotFailureAction = createAction(
  ActionTypes.STOP_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
