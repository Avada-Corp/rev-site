import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';

export const removeBotAction = createAction(
  ActionTypes.REMOVE_BOT,
  props<{ email: string; id: string }>()
);

export const removeBotSuccessAction = createAction(
  ActionTypes.REMOVE_BOT_SUCCESS,
  props<{ bots: Bot[] }>()
);

export const removeBotFailureAction = createAction(
  ActionTypes.REMOVE_BOT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
