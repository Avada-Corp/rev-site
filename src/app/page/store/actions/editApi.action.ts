import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ApiCreate } from '../../types/apiCreate.interface';

export interface EditApi extends ApiCreate {
  apiId: string;
}

export const editApiAction = createAction(
  ActionTypes.EDIT_API_KEY,
  props<{ request: EditApi }>()
);

export const editApiSuccessAction = createAction(
  ActionTypes.EDIT_API_KEY_SUCCESS,
  props<{ apiId: string }>()
);

export const editApiFailureAction = createAction(
  ActionTypes.EDIT_API_KEY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
