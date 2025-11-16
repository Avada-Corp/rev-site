import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const updateBotsByApiAction = createAction(
  ActionTypes.UPDATE_BOTS_BY_API,
  props<{ email: string; apiId: string }>()
);

export const updateBotsByApiSuccessAction = createAction(
  ActionTypes.UPDATE_BOTS_BY_API_SUCCESS,
  props<{ email: string; updatedBotsCount: number }>()
);

export const updateBotsByApiFailureAction = createAction(
  ActionTypes.UPDATE_BOTS_BY_API_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
