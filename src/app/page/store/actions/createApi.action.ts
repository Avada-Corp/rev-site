import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { ApiCreate } from '../../types/apiCreate.interface';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const createApiAction = createAction(
  ActionTypes.CREATE_API_KEY,
  props<{ request: ApiCreate }>()
);

export const createApiSuccessAction = createAction(
  ActionTypes.CREATE_API_KEY_SUCCESS,
  props<{ id: string; email: string }>()
);

export const createApiFailureAction = createAction(
  ActionTypes.CREATE_API_KEY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
