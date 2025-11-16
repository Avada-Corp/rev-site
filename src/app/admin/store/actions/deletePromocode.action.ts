import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const deletePromocodeAction = createAction(
  ActionTypes.DELETE_PROMOCODE,
  props<{ promocodeId: string }>()
);

export const deletePromocodeSuccessAction = createAction(
  ActionTypes.DELETE_PROMOCODE_SUCCESS,
  props<{ promocodeId: string }>()
);

export const deletePromocodeFailureAction = createAction(
  ActionTypes.DELETE_PROMOCODE_FAILURE,
  props<{ errors: any }>()
);
