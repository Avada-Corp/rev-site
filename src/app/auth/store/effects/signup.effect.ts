import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, first } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import {
  signupAction,
  signupFailureAction,
  signupSuccessAction,
} from './../actions/signup.action';
import { PersistanceService } from 'src/app//shared/services/persistance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { addReferralAction } from '../actions/addReferral.action';

@Injectable()
export class SignupEffect {
  signup$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(signupAction),
      switchMap(({ request, refId }) => {
        return this.authService.signup(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            this.persistanceService.set('accessToken', currentUser.accessToken);
            return signupSuccessAction({ currentUser, refId });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            console.error('errorResponse: Singup', errorResponse);
            return of(
              signupFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  addReferralAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signupSuccessAction),
        tap(({ currentUser, refId }) => {
          const { tgAccount } = currentUser;
          if (tgAccount != refId) {
            this.store.dispatch(
              addReferralAction({ email: currentUser.email, refId })
            );
          }
          console.info('signupSuccessAction: ');
        })
      ),
    { dispatch: false }
  );

  signupFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(signupFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private router: Router,
    private messageService: MessageService,
    private store: Store
  ) {}
}
