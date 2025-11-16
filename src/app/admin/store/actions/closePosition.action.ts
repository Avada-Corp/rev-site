import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { OpenPosition } from '../types/adminState.interface';

export const closePositionAction = createAction(
  ActionTypes.CLOSE_POSITION,
  props<{ apiId: string; position: OpenPosition }>()
);

export const closePositionSuccessAction = createAction(
  ActionTypes.CLOSE_POSITION_SUCCESS,
  props<{ messages: string[] }>()
);

export const closePositionFailureAction = createAction(
  ActionTypes.CLOSE_POSITION_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
