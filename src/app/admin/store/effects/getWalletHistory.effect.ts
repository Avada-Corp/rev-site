import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import { TransactionType } from 'src/app/page/types/page.interface';
import {
  getWalletHistoryAction,
  getWalletHistoryFailureAction,
  getWalletHistorySuccessAction,
} from '../actions/getWalletHistory.action';

@Injectable()
export class GetWalletHistoryEffect {
  getWalletHistory$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getWalletHistoryAction),
      switchMap(({ email }) => {
        return this.userService.getWalletHistory(email).pipe(
          map(({ status, data, errors }) => {
            if (status && data) {
              console.log('data: ', data);
              console.log(
                'data: ',
                data.find((t) => t.type.includes('referral'))
              );
              console.log(
                'data: ',
                data.find((t) => t.amount === 28417)
              );
              // Process transactions
              const allTransactions = data
                ? data
                    .map((w) => ({
                      email: w.email,
                      // tgUserName: data.tgUserName || '',
                      tgUserName: '',
                      explanation: w.explanation,
                      isPaid: null,
                      amount: w.amount,
                      amountReserved: 0,
                      date: w.date,
                      explanationData: w.explanationData,
                      type: w.type,
                    }))
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                : [];

              // Separate transactions by type
              const walletCommissions = allTransactions.filter(
                (t) => t.type === TransactionType.COMMISSION
              );

              const walletManualTransactions = allTransactions.filter(
                (t) => t.type === TransactionType.BALANCE
              );

              const walletReferralTransactions = allTransactions.filter(
                (t) => t.type === TransactionType.REFERRAL_DEPOSIT
              );

              // Referral withdrawals - это транзакции типа REFERRAL_WITHDRAWAL
              const walletReferralWithdrawals = allTransactions.filter(
                (t) => t.type === TransactionType.REFERRAL_WITHDRAWAL
              );
              console.log(
                'walletReferralWithdrawals: ',
                walletReferralWithdrawals
              );

              // Partner commissions - это транзакции типа PARTNER_COMMISSION
              const walletPartnerCommissions = allTransactions.filter(
                (t) => t.type === TransactionType.PARTNER_COMMISSION
              );
              console.log(
                'walletPartnerCommissions: ',
                walletPartnerCommissions
              );

              // Crypto wallet transactions - это транзакции типа CRYPTO_WALLET
              const walletCryptoTransactions = allTransactions.filter(
                (t) => t.type === TransactionType.CRYPTO_WALLET
              );
              console.log(
                'walletCryptoTransactions: ',
                walletCryptoTransactions
              );

              return getWalletHistorySuccessAction({
                walletCommissions,
                walletManualTransactions,
                walletReferralTransactions,
                walletReferralWithdrawals,
                walletPartnerCommissions,
                walletCryptoTransactions,
                email,
              });
            } else {
              return getWalletHistoryFailureAction({
                errors: errors || [],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getWalletHistoryFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getWalletHistoryFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getWalletHistoryFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private messageService: MessageService
  ) {}
}
