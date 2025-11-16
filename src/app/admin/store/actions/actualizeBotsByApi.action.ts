import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const actualizeBotsByApiAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_BY_API,
  props<{ email: string; apiId: string; apiName: string }>()
);

export const actualizeBotsByApiSuccessAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_BY_API_SUCCESS
);

export const actualizeBotsByApiFailureAction = createAction(
  ActionTypes.ACTUALIZE_BOTS_BY_API_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
