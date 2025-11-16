import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { EmptyUser } from 'src/app/shared/types/emptyUsersResponse.interface.interface';

export const getEmptyUsersAction = createAction(ActionTypes.GET_EMPTY_USERS);

export const getEmptyUsersSuccessAction = createAction(
  ActionTypes.GET_EMPTY_USERS_SUCCESS,
  props<{ users: EmptyUser[] }>()
);

export const getEmptyUsersFailureAction = createAction(
  ActionTypes.GET_EMPTY_USERS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
