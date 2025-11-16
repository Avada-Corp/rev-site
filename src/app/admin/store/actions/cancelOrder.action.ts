import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { OpenOrder } from 'src/app/shared/types/response.interface';

export const cancelOrderAction = createAction(
  ActionTypes.CANCEL_ORDER,
  props<{ apiId: string; order: OpenOrder }>()
);

export const cancelOrderSuccessAction = createAction(
  ActionTypes.CANCEL_ORDER_SUCCESS,
  props<{ messages: string[] }>()
);

export const cancelOrderFailureAction = createAction(
  ActionTypes.CANCEL_ORDER_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
