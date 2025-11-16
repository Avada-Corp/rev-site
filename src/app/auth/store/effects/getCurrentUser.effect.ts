import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { PersistanceService } from 'src/app/shared/services/persistance.service';
import {
  getCurrentUserAction,
  getCurrentUserSuccessAction,
  getCurrentUserFailureAction,
} from 'src/app/auth/store/actions/getCurrentUser.action';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';
import { getCurrentUserInfoAction } from 'src/app/page/store/actions/getCurrentUserInfo.action';
import { Router } from '@angular/router';

@Injectable()
export class GetCurrentUserEffect {
  getCurrentUser$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getCurrentUserAction),
      switchMap(() => {
        const token = this.persistanceService.get('accessToken');
        if (!token) {
          return of(getCurrentUserFailureAction());
        }

        return this.authService.getCurrentUserByToken(token).pipe(
          map((currentUser: CurrentUserTokenResponseInterface | null) => {
            if (currentUser != null) {
              return getCurrentUserSuccessAction({ currentUser });
            } else {
              return getCurrentUserFailureAction();
            }
          }),

          catchError((e) => {
            return of(getCurrentUserFailureAction());
          })
        );
      })
    )
  );

  getCurrentUserSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getCurrentUserSuccessAction),
      switchMap(({ currentUser }) => {
        return of(
          getCurrentUserInfoAction({
            email: currentUser.email,
          })
        );
      })
    )
  );

  redirectAfterGetCurrentUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getCurrentUserSuccessAction),
        tap(() => {
          const redirectUrl = localStorage.getItem('redirectUrl');
          
          if (redirectUrl) {
            localStorage.removeItem('redirectUrl');
            this.router.navigateByUrl(redirectUrl);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private router: Router
  ) {}
}
