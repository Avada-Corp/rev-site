import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import {
  cancelOrderAction,
  cancelOrderFailureAction,
  cancelOrderSuccessAction,
} from '../actions/cancelOrder.action';
import { getOpenPositionsAction } from '../actions/getOpenPositions.action';
import { Store } from '@ngrx/store';

@Injectable()
export class CancelOrderEffect {
  private currentApiId: string = '';

  cancelOrder$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(cancelOrderAction),
      switchMap(({ apiId, order }) => {
        // Сохраняем apiId для использования в success эффекте
        this.currentApiId = apiId;
        return this.adminService.cancelOrder(apiId, order).pipe(
          map(({ status, errors, messages }) => {
            if (status) {
              return cancelOrderSuccessAction({ messages });
            } else {
              return cancelOrderFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              cancelOrderFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  cancelOrderSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(cancelOrderSuccessAction),
      tap(({ messages }) => {
        messages.forEach((message) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: `Статус от биржи: ${message}`,
            life: 10000,
          });
        });
      }),
      // Обновляем список открытых позиций, используя сохраненный apiId
      switchMap(() => of(getOpenPositionsAction({ apiId: this.currentApiId })))
    )
  );

  cancelOrderFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(cancelOrderFailureAction),
        tap(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось отменить ордер',
            life: 10000,
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService,
    private store: Store
  ) {}
}
