import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  map,
  catchError,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import {
  closePositionAction,
  closePositionFailureAction,
  closePositionSuccessAction,
} from '../actions/closePosition.action';
import { getOpenPositionsAction } from '../actions/getOpenPositions.action';
import { Store } from '@ngrx/store';

@Injectable()
export class ClosePositionEffect {
  private currentApiId: string = '';

  closePosition$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(closePositionAction),
      switchMap(({ apiId, position }) => {
        // Сохраняем apiId для использования в success эффекте
        this.currentApiId = apiId;
        return this.adminService.closePosition(apiId, position).pipe(
          map(({ status, errors, messages }) => {
            if (status) {
              return closePositionSuccessAction({ messages });
            } else {
              return closePositionFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              closePositionFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  closePositionSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(closePositionSuccessAction),
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

  closePositionFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(closePositionFailureAction),
        tap(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось закрыть позицию',
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
