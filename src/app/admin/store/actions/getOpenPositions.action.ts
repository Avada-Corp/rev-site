import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { OpenPosition } from '../types/adminState.interface';
import { OpenPositionData } from 'src/app/shared/types/response.interface';

export const getOpenPositionsAction = createAction(
  ActionTypes.GET_OPEN_POSITIONS,
  props<{ apiId: string }>()
);

export const getOpenPositionsSuccessAction = createAction(
  ActionTypes.GET_OPEN_POSITIONS_SUCCESS,
  props<{ positions: OpenPositionData }>()
);

export const getOpenPositionsFailureAction = createAction(
  ActionTypes.GET_OPEN_POSITIONS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
); 