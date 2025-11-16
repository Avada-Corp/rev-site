import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { PersistanceService } from './../../../shared/services/persistance.service';
import { Router } from '@angular/router';
import {
  loginAction,
  loginFailureAction,
  loginSuccessAction,
} from './../actions/login.action';
import { MessageService } from 'primeng/api';
import { showErrors } from './../../../page/store/effects/common';
import { getCurrentUserAction } from '../actions/getCurrentUser.action';
import { Store } from '@ngrx/store';

@Injectable()
export class LoginEffect {
  login$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(loginAction),
      switchMap(({ request }) => {
        return this.authService.login(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            this.persistanceService.set('accessToken', currentUser.accessToken);
            return loginSuccessAction({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              loginFailureAction({
                errors: errorResponse.error?.message ?? [],
              })
            );
          })
        );
      })
    )
  );

  loginFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(loginFailureAction),
        tap(({ errors }) => {
          showErrors(errors, this.messageService);
        })
      ),
    { dispatch: false }
  );

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessAction),
        tap(() => {
          const redirectUrl = localStorage.getItem('redirectUrl');
          
          if (redirectUrl) {
            localStorage.removeItem('redirectUrl');
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private router: Router,
    private store: Store,
    private messageService: MessageService
  ) {}
}
