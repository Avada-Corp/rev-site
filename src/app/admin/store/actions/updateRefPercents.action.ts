import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { RefPercent } from '../types/adminState.interface';

export const updateRefPercentsAction = createAction(
  ActionTypes.UPDATE_REF_PERCENTS_COMMISSION,
  props<{
    email: string;
    refPercent1: number;
    refPercent2: number;
    refPercent3: number;
  }>()
);

export const updateRefPercentsSuccessAction = createAction(
  ActionTypes.UPDATE_REF_PERCENTS_COMMISSION_SUCCESS
);

export const updateRefPercentsFailureAction = createAction(
  ActionTypes.UPDATE_REF_PERCENTS_COMMISSION_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
