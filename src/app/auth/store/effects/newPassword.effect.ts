import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import {
  newPasswordAction,
  newPasswordSuccessAction,
  newPasswordFailureAction,
} from './../actions/newPassword.action';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class NewPasswordEffect {
  newPassword$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(newPasswordAction),
      switchMap(({ password, id }) => {
        return this.authService.newPassword(password, id).pipe(
          map((isPasswordReset: boolean) => {
            if (isPasswordReset) {
              return newPasswordSuccessAction();
            } else {
              return newPasswordFailureAction({
                errors: ['unknown error'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              newPasswordFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  newPasswordSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(newPasswordSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            life: 5000,
            detail: 'Пароль обновлен',
          });
          this.router.navigateByUrl('/auth/login');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
}
