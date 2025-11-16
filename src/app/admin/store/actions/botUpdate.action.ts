import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';

export const updateBotAction = createAction(
  ActionTypes.UPDATE_BOT,
  props<{ email: string; bot: Partial<Bot> }>()
);

export const updateBotSuccessAction = createAction(
  ActionTypes.UPDATE_BOT_SUCCESS,
  props<{ bots: Bot[]; status: boolean }>()
);

export const updateBotFailureAction = createAction(
  ActionTypes.UPDATE_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
