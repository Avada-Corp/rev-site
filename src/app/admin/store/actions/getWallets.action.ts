import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { WalletBalance } from 'src/app/page/types/page.interface';

export const getWalletsAction = createAction(ActionTypes.GET_WALLETS);

export const getWalletsSuccessAction = createAction(
  ActionTypes.GET_WALLETS_SUCCESS,
  props<{ wallets: WalletBalance[] }>()
);

export const getWalletsFailureAction = createAction(
  ActionTypes.GET_WALLETS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
