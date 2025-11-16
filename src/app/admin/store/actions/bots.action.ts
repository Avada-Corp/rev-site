import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';

export const getBotsAction = createAction(ActionTypes.GET_BOTS);

export const getBotsSuccessAction = createAction(
  ActionTypes.GET_BOTS_SUCCESS,
  props<{ bots: Bot[] }>()
);

export const getBotsFailureAction = createAction(
  ActionTypes.GET_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
