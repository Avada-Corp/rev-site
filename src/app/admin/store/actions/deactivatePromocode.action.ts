import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const deactivatePromocodeAction = createAction(
  ActionTypes.DEACTIVATE_PROMOCODE,
  props<{ promocodeId: string }>()
);

export const deactivatePromocodeSuccessAction = createAction(
  ActionTypes.DEACTIVATE_PROMOCODE_SUCCESS,
  props<{ promocodeId: string }>()
);

export const deactivatePromocodeFailureAction = createAction(
  ActionTypes.DEACTIVATE_PROMOCODE_FAILURE,
  props<{ errors: any }>()
);
