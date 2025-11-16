import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const deleteApiAction = createAction(
  ActionTypes.DELETE_API_KEY,
  props<{ email: string; apiId: string }>()
);

export const deleteApiSuccessAction = createAction(
  ActionTypes.DELETE_API_KEY_SUCCESS,
  props<{ apiId: string }>()
);

export const deleteApiFailureAction = createAction(
  ActionTypes.DELETE_API_KEY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
