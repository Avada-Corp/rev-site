import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export interface UserCommissionReportData {
  text: string;
  pdfBase64?: string;
  pdfUrl?: string;
}

export const getUserCommissionReportAction = createAction(
  ActionTypes.GET_USER_COMMISSION_REPORT,
  props<{ email: string }>()
);

export const getUserCommissionReportSuccessAction = createAction(
  ActionTypes.GET_USER_COMMISSION_REPORT_SUCCESS,
  props<{ email: string; reportData: UserCommissionReportData }>()
);

export const getUserCommissionReportFailureAction = createAction(
  ActionTypes.GET_USER_COMMISSION_REPORT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
