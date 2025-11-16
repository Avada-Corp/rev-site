import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  getBotSettingsAction,
  getBotSettingsSuccessAction,
  getBotSettingsFailureAction,
} from '../actions/botSettings.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class GetBotSettingsEffect {
  botSettings$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getBotSettingsAction),
      switchMap(() => {
        return this.adminService.getBotSettings().pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return getBotSettingsSuccessAction({
                settings: data,
              });
            } else {
              return getBotSettingsFailureAction({
                errors: errors,
                status: 200,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getBotSettingsFailureAction({
                errors: errorResponse.error.message,
                status: errorResponse.status,
              })
            );
          })
        );
      })
    )
  );

  getBotSettingsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getBotSettingsFailureAction),
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
