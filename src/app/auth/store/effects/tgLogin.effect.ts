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
  tgLoginAction,
  tgLoginSuccessAction,
  tgLoginFailureAction,
} from './../actions/tgLogin.action';
import { MessageService } from 'primeng/api';
import { showErrors } from './../../../page/store/effects/common';
import { getCurrentUserAction } from '../actions/getCurrentUser.action';
import { Store } from '@ngrx/store';
import { loginSuccessAction } from '../actions/login.action';
import { addReferralAction } from '../actions/addReferral.action';
import { TgLoginResponseInterface } from '../../types/tgLoginResponse.interface';

@Injectable()
export class TgLoginEffect {
  login$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(tgLoginAction),
      switchMap(({ chatId, refId }) => {
        return this.authService.tgLogin(chatId).pipe(
          map((tgLoginResponse: TgLoginResponseInterface) => {
            this.persistanceService.set(
              'accessToken',
              tgLoginResponse.accessToken
            );
            return tgLoginSuccessAction({
              email: tgLoginResponse.email,
              chatId: tgLoginResponse.tgAccount,
              refId,
              isCreatedAcc: tgLoginResponse.isCreated,
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              tgLoginFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  tgLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(tgLoginSuccessAction),
        tap(({ chatId, email, refId, isCreatedAcc }) => {
          if (isCreatedAcc && chatId != refId) {
            this.store.dispatch(addReferralAction({ email, refId }));
          }
          this.router.navigateByUrl('/');
          this.store.dispatch(getCurrentUserAction());
          console.info('tsLoginSuccessAction: ');
        })
      ),
    { dispatch: false }
  );

  tgLoginFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(tgLoginFailureAction),
        tap(({ errors }) => {
          showErrors(errors, this.messageService);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private messageService: MessageService,
    private store: Store,
    private router: Router
  ) {}
}
