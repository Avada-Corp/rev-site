import { createAction, props } from '@ngrx/store';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { ExpectedPayment } from 'src/app/page/types/page.interface';

export const getWalletDetailsAction = createAction(
  ActionTypes.GET_WALLET_DETAILS,
  props<{ email: string }>()
);

export const getWalletDetailsSuccessAction = createAction(
  ActionTypes.GET_WALLET_DETAILS_SUCCESS,
  props<{
    email: string;
    expectedPayments: ExpectedPayment[];
  }>()
);

export const getWalletDetailsFailureAction = createAction(
  ActionTypes.GET_WALLET_DETAILS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
