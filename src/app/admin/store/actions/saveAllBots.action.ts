import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';

export const saveAllBotsAction = createAction(
  ActionTypes.SAVE_ALL_BOTS,
  props<{ email: string; bots: Bot[] }>()
);

export const saveAllBotsSuccessAction = createAction(
  ActionTypes.SAVE_ALL_BOTS_SUCCESS,
  props<{ bots: Bot[] }>()
);

export const saveAllBotsFailureAction = createAction(
  ActionTypes.SAVE_ALL_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
