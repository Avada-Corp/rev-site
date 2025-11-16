import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { UserCommissions } from '../types/adminState.interface';

export const getUsersCommissionsAction = createAction(
  ActionTypes.GET_USERS_COMMISSIONS
);

export const getUsersCommissionsSuccessAction = createAction(
  ActionTypes.GET_USERS_COMMISSIONS_SUCCESS,
  props<{ usersCommissions: UserCommissions[] }>()
);

export const getUsersCommissionsFailureAction = createAction(
  ActionTypes.GET_USERS_COMMISSIONS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
