import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  saveAllBotsAction,
  saveAllBotsSuccessAction,
  saveAllBotsFailureAction,
} from '../actions/saveAllBots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class SaveAllBotsEffect {
  saveAllBots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(saveAllBotsAction),
      switchMap(({ email, bots }) => {
        return this.adminService.saveAllBots(email, bots).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return saveAllBotsSuccessAction({
                bots: data.map((bot) => ({ ...bot, id: bot._id })),
              });
            } else {
              return saveAllBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              saveAllBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  saveAllBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(saveAllBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  saveAllBotsSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(saveAllBotsSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: 'Bot order updated successfully',
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
