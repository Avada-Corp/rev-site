import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  withdrawRefBalanceAction,
  withdrawRefBalanceSuccessAction,
  withdrawRefBalanceFailureAction,
} from '../actions/withdrawRefBalance.action';
import { AdminService } from '../../services/admin.service';
import { getWalletsAction } from '../actions/getWallets.action';

@Injectable()
export class WithdrawRefBalanceEffect {
  withdrawRefBalance$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(withdrawRefBalanceAction),
      switchMap(({ email, amount }) => {
        return this.adminService.withdrawRefBalance(email, amount).pipe(
          map(({ status, errors }) => {
            if (status) {
              return withdrawRefBalanceSuccessAction({
                email: email,
                amount: amount,
              });
            } else {
              return withdrawRefBalanceFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              withdrawRefBalanceFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  withdrawRefBalanceFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(withdrawRefBalanceFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  withdrawRefBalanceSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(withdrawRefBalanceSuccessAction),
      tap(({ email, amount }) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: `Referral balance for ${email} withdrawn by ${amount} successfully`,
        });
      }),
      switchMap(() => of(getWalletsAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
