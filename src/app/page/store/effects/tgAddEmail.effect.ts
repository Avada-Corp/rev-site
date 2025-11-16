import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import {
  tgAddEmailAction,
  tgAddEmailSuccessAction,
  tgAddEmailFailureAction,
} from '../actions/tgAddEmail.action';
import { logoutAction } from 'src/app/auth/store/actions/logout.action';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable()
export class TgAddEmailEffect {
  tgAddEmail$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(tgAddEmailAction),
      switchMap(({ email, chatId, password }) => {
        return this.authService.tgAddEmail(email, password, chatId).pipe(
          map(({ status, errors }) => {
            return status
              ? tgAddEmailSuccessAction()
              : tgAddEmailFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            console.error('errorResponse: ', errorResponse);
            return of(
              tgAddEmailFailureAction({
                errors: [errorResponse.error?.message],
              })
            );
          })
        );
      })
    )
  );

  tgAddEmailSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(tgAddEmailSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Email добавлен к аккаунту',
        });
      }),
      switchMap((_) => {
        return of(logoutAction());
      })
    )
  );

  tgAddEmailFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(tgAddEmailFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private messageService: MessageService
  ) {}
}
