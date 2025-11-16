import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { NewReport } from 'src/app/page/types/page.interface';

export const getReportsAction = createAction(
  ActionTypes.GET_REPORTS,
  props<{ start: number; to: number; email: string | null }>()
);

export const getReportsSuccessAction = createAction(
  ActionTypes.GET_REPORTS_SUCCESS,
  props<{ reports: NewReport[] }>()
);

export const getReportsFailureAction = createAction(
  ActionTypes.GET_REPORTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const setReportsDateRangeAction = createAction(
  ActionTypes.SET_REPORTS_DATE_RANGE,
  props<{ fromDate: number; toDate: number }>()
);
