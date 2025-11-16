import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  removeBotAction,
  removeBotSuccessAction,
  removeBotFailureAction,
} from '../actions/removeBot.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class RemoveBotEffect {
  removeBot$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(removeBotAction),
      switchMap(({ email, id }) => {
        return this.adminService.removeBot(email, id).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return removeBotSuccessAction({
                bots: data.map((bot) => ({ ...bot, id: bot._id })),
              });
            } else {
              return removeBotFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              removeBotFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  removeBotFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(removeBotFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  removeBotSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(removeBotSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: 'Bot removed successfully',
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
