import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { Report } from '../../types/page.interface';

export const getReportsAction = createAction(
  ActionTypes.GET_REPORTS,
  props<{ start: number; to: number; email: string | null }>()
);

export const getReportsSuccessAction = createAction(
  ActionTypes.GET_REPORTS_SUCCESS,
  props<{ reports: Report[] }>()
);

export const getReportsFailureAction = createAction(
  ActionTypes.GET_REPORTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
