import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { RefLevels } from '../types/adminState.interface';

export const getRefPercentsAction = createAction(
  ActionTypes.GET_REF_PERCENTS_COMMISSIONS
);

export const getRefPercentsSuccessAction = createAction(
  ActionTypes.GET_REF_PERCENTS_COMMISSIONS_SUCCESS,
  props<{ refLevels: RefLevels[] }>()
);

export const getRefPercentsFailureAction = createAction(
  ActionTypes.GET_REF_PERCENTS_COMMISSIONS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
