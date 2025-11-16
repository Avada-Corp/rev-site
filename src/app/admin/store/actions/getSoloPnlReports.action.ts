import { createAction, props } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { NewReport } from 'src/app/page/types/page.interface';

export const getSoloPnlReportsAction = createAction(
  ActionTypes.GET_SOLO_PNL_REPORTS,
  props<{ from: number; to: number; email: string }>()
);

export const getSoloPnlReportsSuccessAction = createAction(
  ActionTypes.GET_SOLO_PNL_REPORTS_SUCCESS,
  props<{ reports: NewReport[]; email: string }>()
);

export const getSoloPnlReportsFailureAction = createAction(
  ActionTypes.GET_SOLO_PNL_REPORTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
