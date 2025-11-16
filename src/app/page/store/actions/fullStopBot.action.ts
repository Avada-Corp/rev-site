import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const fullStopBotAction = createAction(
  ActionTypes.FULL_STOP_BOT,
  props<{ email: string; apiId: string }>()
);

export const fullStopBotSuccessAction = createAction(
  ActionTypes.FULL_STOP_BOT_SUCCESS,
  props<{ messages?: string[] }>()
);

export const fullStopBotFailureAction = createAction(
  ActionTypes.FULL_STOP_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
