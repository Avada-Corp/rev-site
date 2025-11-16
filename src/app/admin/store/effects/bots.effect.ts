import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  getBotsFailureAction,
  getBotsAction,
  getBotsSuccessAction,
} from '../actions/bots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class GetBotsEffect {
  bots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getBotsAction),
      switchMap(() => {
        return this.adminService.getBots().pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return getBotsSuccessAction({
                bots: data.map((bot) => ({ ...bot, id: bot._id })),
              });
            } else {
              return getBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  getBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
