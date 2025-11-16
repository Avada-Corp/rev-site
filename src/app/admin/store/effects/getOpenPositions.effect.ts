import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import {
  getOpenPositionsAction,
  getOpenPositionsFailureAction,
  getOpenPositionsSuccessAction,
} from '../actions/getOpenPositions.action';

@Injectable()
export class GetOpenPositionsEffect {
  getOpenPositions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getOpenPositionsAction),
      switchMap(({ apiId }) => {
        return this.adminService.getOpenPositionsByApi(apiId).pipe(
          map(({ data, status, errors }) => {
            if (status) {
              return getOpenPositionsSuccessAction({
                positions: data,
              });
            } else {
              return getOpenPositionsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getOpenPositionsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  getOpenPositionsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getOpenPositionsFailureAction),
        tap(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось получить открытые позиции',
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
