import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  topUpBalanceAction,
  topUpBalanceSuccessAction,
  topUpBalanceFailureAction,
} from '../actions/topUpBalance.action';
import { AdminService } from '../../services/admin.service';
import { getWalletsAction } from '../actions/getWallets.action';

@Injectable()
export class TopUpBalanceEffect {
  topUpBalance$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(topUpBalanceAction),
      switchMap(({ email, amount }) => {
        return this.adminService.topUpBalance(email, amount).pipe(
          map(({ status, errors }) => {
            if (status) {
              return topUpBalanceSuccessAction({
                email: email,
                amount: amount,
              });
            } else {
              return topUpBalanceFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              topUpBalanceFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  topUpBalanceFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(topUpBalanceFailureAction),
        tap(({ errors }) => showErrors([...(errors || []), "Ошибка при пополнении баланса"], this.messageService))
      ),
    { dispatch: false }
  );

  topUpBalanceSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(topUpBalanceSuccessAction),
      tap(({ email, amount }) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: `Balance for ${email} topped up by ${amount} successfully`,
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
