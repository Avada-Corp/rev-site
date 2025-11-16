import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  updateBotsByApiAction,
  updateBotsByApiFailureAction,
  updateBotsByApiSuccessAction,
} from '../actions/updateBotsByApi.action';
import { AdminService } from '../../services/admin.service';
import { getUsersAction } from '../actions/users.action';
import {
  defaultLimitValue,
  defaultPageValue,
} from '../../services/controlApi.service';

@Injectable()
export class UpdateBotsByApiEffect {
  updateBotsByApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateBotsByApiAction),
      switchMap(({ email, apiId }) => {
        return this.adminService.updateBotByApi(email, apiId).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return updateBotsByApiSuccessAction({
                updatedBotsCount: data,
                email,
              });
            } else {
              return updateBotsByApiFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              updateBotsByApiFailureAction({
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
        ofType(updateBotsByApiFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updateBotsByApiSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateBotsByApiSuccessAction),
      tap(({ updatedBotsCount }) => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: ` ${updatedBotsCount} bots was updated successfully`,
        });
      }),
      switchMap(({ email }) =>
        of(
          getUsersAction({
            email,
            page: defaultPageValue,
            limit: defaultLimitValue,
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
