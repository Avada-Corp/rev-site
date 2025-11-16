import { createAction, props } from '@ngrx/store';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const updateParentRefAction = createAction(
  ActionTypes.UPDATE_PARENT_REF,
  props<{ email: string; parentRef: string }>()
);

export const updateParentRefSuccessAction = createAction(
  ActionTypes.UPDATE_PARENT_REF_SUCCESS,
  props<{ messages: string[] }>()
);

export const updateParentRefFailureAction = createAction(
  ActionTypes.UPDATE_PARENT_REF_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
); 