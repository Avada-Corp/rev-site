import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import {
  Promocode,
  PromocodeGenerateRequest,
} from '../types/adminState.interface';

export const generatePromocodesAction = createAction(
  ActionTypes.GENERATE_PROMOCODES,
  props<{ request: PromocodeGenerateRequest }>()
);

export const generatePromocodesSuccessAction = createAction(
  ActionTypes.GENERATE_PROMOCODES_SUCCESS,
  props<{ promocodes: Promocode[] }>()
);

export const generatePromocodesFailureAction = createAction(
  ActionTypes.GENERATE_PROMOCODES_FAILURE,
  props<{ error: string }>()
);
