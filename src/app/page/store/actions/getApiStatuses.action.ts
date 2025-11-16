import { createAction, props } from '@ngrx/store';

import { CurrentUserApi } from '../../types/userInfo.interface';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const getApiStatusesAction = createAction(
  ActionTypes.GET_API_STATUSES_INFO,
  props<{ email: string }>()
);

export const getApiStatusesSuccessAction = createAction(
  ActionTypes.GET_API_STATUSES_INFO_SUCCESS,
  props<{ apiKeys: CurrentUserApi[] | null }>()
);

export const getApiStatusesFailureAction = createAction(
  ActionTypes.GET_API_STATUSES_INFO_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
