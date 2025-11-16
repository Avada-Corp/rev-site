import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { PersistanceService } from '../../../shared/services/persistance.service';
import {
  logoutAction,
  logoutFailureAction,
  logoutSuccessAction,
} from '../actions/logout.action';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LogoutEffect {
  logout$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(logoutAction),
      switchMap(() => {
        this.persistanceService.remove('accessToken');
        return of(logoutSuccessAction());
      })
    )
  );

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccessAction),
        tap(() => {
          this.router.navigateByUrl('/auth/login');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private persistanceService: PersistanceService,
    private authService: AuthService,
    private router: Router
  ) {}
}
