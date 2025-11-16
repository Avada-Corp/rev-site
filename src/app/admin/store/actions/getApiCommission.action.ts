import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { CommissionApi } from '../types/adminState.interface';

export const getApiCommissionAction = createAction(
  ActionTypes.GET_API_COMMISSIONS
);

export const getApiCommissionSuccessAction = createAction(
  ActionTypes.GET_API_COMMISSIONS_SUCCESS,
  props<{ commissions: CommissionApi[] }>()
);

export const getApiCommissionFailureAction = createAction(
  ActionTypes.GET_API_COMMISSIONS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
