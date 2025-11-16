import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { UserInfo } from '../types/adminState.interface';

export const getUsernamesAction = createAction(
  ActionTypes.GET_USERNAMES
);

export const getUsernamesSuccessAction = createAction(
  ActionTypes.GET_USERNAMES_SUCCESS,
  props<{ usernames: UserInfo[] }>()
);

export const getUsernamesFailureAction = createAction(
  ActionTypes.GET_USERNAMES_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
); 