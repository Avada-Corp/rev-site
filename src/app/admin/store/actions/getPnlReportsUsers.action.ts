import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export interface PnlReportsUser {
  username: string;
}

export const getPnlReportsUsersAction = createAction(
  ActionTypes.GET_PNL_REPORTS_USERS,
  props<{ start: number; to: number }>()
);

export const getPnlReportsUsersSuccessAction = createAction(
  ActionTypes.GET_PNL_REPORTS_USERS_SUCCESS,
  props<{ users: PnlReportsUser[] }>()
);

export const getPnlReportsUsersFailureAction = createAction(
  ActionTypes.GET_PNL_REPORTS_USERS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
