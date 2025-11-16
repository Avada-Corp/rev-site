import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  actualizeBotsByApiAction,
  actualizeBotsByApiFailureAction,
  actualizeBotsByApiSuccessAction,
} from '../actions/actualizeBotsByApi.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class ActualizeBotsByApiEffect {
  updateBotsByApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(actualizeBotsByApiAction),
      switchMap(({ email, apiId, apiName }) => {
        return this.adminService.actualizeBotByApi(email, apiId, apiName).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return actualizeBotsByApiSuccessAction();
            } else {
              return actualizeBotsByApiFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              actualizeBotsByApiFailureAction({
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
        ofType(actualizeBotsByApiFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updateBotsByApiSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(actualizeBotsByApiSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: `Актуализация запущена, логи отправляются в телеграм`,
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
