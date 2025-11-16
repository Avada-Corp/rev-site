import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { WalletCommission } from 'src/app/page/types/page.interface';

export const getWalletHistoryAction = createAction(
  ActionTypes.GET_WALLET_HISTORY,
  props<{ email: string }>()
);

export const getWalletHistorySuccessAction = createAction(
  ActionTypes.GET_WALLET_HISTORY_SUCCESS,
  props<{
    walletCommissions: WalletCommission[];
    walletManualTransactions: WalletCommission[];
    walletReferralTransactions: WalletCommission[];
    walletReferralWithdrawals: WalletCommission[];
    walletPartnerCommissions: WalletCommission[];
    walletCryptoTransactions: WalletCommission[];
    email: string;
  }>()
);

export const getWalletHistoryFailureAction = createAction(
  ActionTypes.GET_WALLET_HISTORY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
