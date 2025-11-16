import { createAction, props } from '@ngrx/store';

import { CurrentUserApi } from '../../types/userInfo.interface';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const getCurrentUserInfoAction = createAction(
  ActionTypes.GET_CURRENT_USER_INFO,
  props<{ email: string }>()
);

export const getCurrentUserInfoSuccessAction = createAction(
  ActionTypes.GET_CURRENT_USER_INFO_SUCCESS,
  props<{ apiKeys: CurrentUserApi[] | null }>()
);

export const getCurrentUserInfoFailureAction = createAction(
  ActionTypes.GET_CURRENT_USER_INFO_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
