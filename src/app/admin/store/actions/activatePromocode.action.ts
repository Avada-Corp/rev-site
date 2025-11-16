import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const activatePromocodeAction = createAction(
  ActionTypes.ACTIVATE_PROMOCODE,
  props<{ promocodeId: string }>()
);

export const activatePromocodeSuccessAction = createAction(
  ActionTypes.ACTIVATE_PROMOCODE_SUCCESS,
  props<{ promocodeId: string }>()
);

export const activatePromocodeFailureAction = createAction(
  ActionTypes.ACTIVATE_PROMOCODE_FAILURE,
  props<{ errors: any }>()
);
