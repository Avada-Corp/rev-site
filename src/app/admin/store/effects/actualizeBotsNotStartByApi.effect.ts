import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  actualizeBotsNotStartByApiAction,
  actualizeBotsNotStartByApiFailureAction,
  actualizeBotsNotStartByApiSuccessAction,
} from '../actions/actualizeBotsNotStartByApi.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class ActualizeBotsNotStartByApiEffect {
  updateBotsByApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(actualizeBotsNotStartByApiAction),
      switchMap(({ email, apiId, apiName }) => {
        return this.adminService
          .actualizeBotNotStartByApi(email, apiId, apiName)
          .pipe(
            map(({ status, data, errors }) => {
              if (status) {
                return actualizeBotsNotStartByApiSuccessAction();
              } else {
                return actualizeBotsNotStartByApiFailureAction({
                  errors: errors,
                });
              }
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                actualizeBotsNotStartByApiFailureAction({
                  errors: errorResponse.error.message,
                })
              );
            })
          );
      })
    )
  );

  updateBotsByApiFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(actualizeBotsNotStartByApiFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updateBotsByApiSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(actualizeBotsNotStartByApiSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: `Актуализация запущена БЕЗ СТАРТА БОТОВ, логи отправляются в телеграм`,
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
