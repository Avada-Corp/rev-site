import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  updateBotAction,
  updateBotSuccessAction,
  updateBotFailureAction,
} from '../actions/botUpdate.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class UpdateBotEffect {
  updateBot$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateBotAction),
      switchMap(({ email, bot }) => {
        return this.adminService.updateBot(email, bot).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return updateBotSuccessAction({
                status,
                bots: data.map((bot) => ({ ...bot, id: bot._id })),
              });
            } else {
              return updateBotFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              updateBotFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  updateBotFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateBotFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updateBotSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateBotSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: 'Bot settings updated successfully',
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
