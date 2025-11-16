import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import {
  cancelAllOrdersAction,
  cancelAllOrdersFailureAction,
  cancelAllOrdersSuccessAction,
} from '../actions/cancelAllOrders.action';
import { getOpenPositionsAction } from '../actions/getOpenPositions.action';
import { Store } from '@ngrx/store';

@Injectable()
export class CancelAllOrdersEffect {
  private currentApiId: string = '';

  cancelAllOrders$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(cancelAllOrdersAction),
      switchMap(({ apiId, orders }) => {
        // Сохраняем apiId для использования в success эффекте
        this.currentApiId = apiId;
        return this.adminService.cancelAllOrders(apiId, orders).pipe(
          map(({ status, errors, messages }) => {
            if (status) {
              return cancelAllOrdersSuccessAction({ messages });
            } else {
              return cancelAllOrdersFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              cancelAllOrdersFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  cancelAllOrdersSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(cancelAllOrdersSuccessAction),
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

  cancelAllOrdersFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(cancelAllOrdersFailureAction),
        tap(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось отменить все ордера',
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
