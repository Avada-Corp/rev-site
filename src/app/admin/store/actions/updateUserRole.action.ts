import { createAction, props } from '@ngrx/store';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { UserRole } from 'src/app/shared/types/userRole.enum';
import { ActionTypes } from '../actionTypes';

export const updateUserRoleAction = createAction(
  ActionTypes.UPDATE_USER_ROLE,
  props<{ email: string; role: UserRole }>()
);

export const updateUserRoleSuccessAction = createAction(
  ActionTypes.UPDATE_USER_ROLE_SUCCESS,
  props<{ message: string }>()
);

export const updateUserRoleFailureAction = createAction(
  ActionTypes.UPDATE_USER_ROLE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
