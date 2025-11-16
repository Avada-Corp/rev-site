import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import {
  AdminStateInterface,
  ApiWithEmail,
  PaginationMeta,
  User,
} from '../types/adminState.interface';

export const getUsersAction = createAction(
  ActionTypes.GET_USERS,
  props<{ email: string; page?: number; limit?: number }>()
);

export const getUsersSuccessAction = createAction(
  ActionTypes.GET_USERS_SUCCESS,
  props<{ users: ApiWithEmail[]; meta: PaginationMeta }>()
);

export const getUsersFailureAction = createAction(
  ActionTypes.GET_USERS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const setUsersPageAction = createAction(
  ActionTypes.SET_USERS_PAGE,
  props<{ page: number; limit: number }>()
);
