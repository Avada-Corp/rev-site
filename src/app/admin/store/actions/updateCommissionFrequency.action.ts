import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';

export const updateCommissionFrequencyAction = createAction(
  ActionTypes.UPDATE_COMMISSION_FREQUENCY,
  props<{
    email: string;
    commissionType: "weekly"| "monthly"
  }>()
);

export const updateCommissionFrequencySuccessAction = createAction(
  ActionTypes.UPDATE_COMMISSION_FREQUENCY_SUCCESS,
  props<{
    email: string;
    commissionType: 'weekly' | 'monthly';
  }>()
);

export const updateCommissionFrequencyFailureAction = createAction(
  ActionTypes.UPDATE_COMMISSION_FREQUENCY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
