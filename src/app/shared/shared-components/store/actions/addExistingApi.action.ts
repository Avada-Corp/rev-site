import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ApiCreate } from 'src/app/page/types/apiCreate.interface';

export const addExistingApiAction = createAction(
  ActionTypes.ADD_EXISTING_API_KEY,
  props<{ request: ApiCreate }>()
);

export const addExistingApiSuccessAction = createAction(
  ActionTypes.ADD_EXISTING_API_KEY_SUCCESS,
  props<{ id: string; email: string }>()
);

export const addExistingApiFailureAction = createAction(
  ActionTypes.ADD_EXISTING_API_KEY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
