import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import { showErrors } from 'src/app/page/store/effects/common';
import {
  getWalletDetailsAction,
  getWalletDetailsSuccessAction,
  getWalletDetailsFailureAction,
} from '../actions/getWalletDetails.action';
import { ExpectedPayment } from 'src/app/page/types/page.interface';

@Injectable()
export class GetWalletDetailsEffect {
  getWalletDetails$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getWalletDetailsAction),
      switchMap(({ email }) => {
        return this.adminService.getWalletDetails(email).pipe(
          map(({ status, data, errors }) => {
            if (status && data) {
              // Данные приходят массивом
              const expectedPayments: ExpectedPayment[] = Array.isArray(data)
                ? this.transformExpectedPayments(data)
                : [];

              return getWalletDetailsSuccessAction({
                email,
                expectedPayments,
              });
            } else {
              return getWalletDetailsFailureAction({
                errors: errors || [],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getWalletDetailsFailureAction({
                errors: [
                  errorResponse.error?.message ||
                    'Ошибка загрузки деталей кошелька',
                ],
              })
            );
          })
        );
      })
    )
  );

  getWalletDetailsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getWalletDetailsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  private transformExpectedPayments(data: any[]): ExpectedPayment[] {
    return data.map((item) => ({
      email: item.email || '',
      isPaid: item.isPaid || false,
      amount: item.amount || 0,
      explanation: item.explanation || 'Без описания',
      fromCommission: item.fromCommission || '',
      commissionAmount: item.commissionAmount || 0,
      tgUserName: item.tgUserName || '',
      commissionExplanation: item.commissionExplanation || '',
      amountReserved: item.amountReserved || 0,
    }));
  }

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
