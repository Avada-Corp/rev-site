import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { Promocode } from '../types/adminState.interface';

export const getPromocodesAction = createAction(ActionTypes.GET_PROMOCODES);

export const getPromocodesSuccessAction = createAction(
  ActionTypes.GET_PROMOCODES_SUCCESS,
  props<{ promocodes: Promocode[] }>()
);

export const getPromocodesFailureAction = createAction(
  ActionTypes.GET_PROMOCODES_FAILURE,
  props<{ error: string }>()
);
