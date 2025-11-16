import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { OpenOrder } from 'src/app/shared/types/response.interface';

export const cancelAllOrdersAction = createAction(
  ActionTypes.CANCEL_ALL_ORDERS,
  props<{ apiId: string; orders: OpenOrder[] }>()
);

export const cancelAllOrdersSuccessAction = createAction(
  ActionTypes.CANCEL_ALL_ORDERS_SUCCESS,
  props<{ messages: string[] }>()
);

export const cancelAllOrdersFailureAction = createAction(
  ActionTypes.CANCEL_ALL_ORDERS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
