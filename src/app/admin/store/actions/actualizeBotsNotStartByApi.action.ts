import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const actualizeBotsNotStartByApiAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_NOT_START_BY_API,
  props<{ email: string; apiId: string; apiName: string }>()
);

export const actualizeBotsNotStartByApiSuccessAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_NOT_START_BY_API_SUCCESS
);

export const actualizeBotsNotStartByApiFailureAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_NOT_START_BY_API_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
