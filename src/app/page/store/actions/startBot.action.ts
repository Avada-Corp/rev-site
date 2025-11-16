import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const startBotAction = createAction(
  ActionTypes.START_BOT,
  props<{ email: string; apiId: string }>()
);

export const startBotSuccessAction = createAction(
  ActionTypes.START_BOT_SUCCESS,
  props<{ messages?: string[] }>()
);

export const startBotFailureAction = createAction(
  ActionTypes.START_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
