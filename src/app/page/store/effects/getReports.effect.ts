import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  map,
  catchError,
  switchMap,
  tap,
  first,
  timeout,
} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import {
  getReportsAction,
  getReportsSuccessAction,
  getReportsFailureAction,
} from '../actions/getReports.action';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { getCurrentUserInfoAction } from '../actions/getCurrentUserInfo.action';

@Injectable()
export class GetReportsEffect {
  getReports$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getReportsAction),
      switchMap(({ start, to, email }) => {
        return this.userService.getReports(start, to, email).pipe(
          map(({ status, data, errors }) => {
            return status
              ? getReportsSuccessAction({
                  reports: data,
                })
              : getReportsFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getReportsFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  // getReportsSuccess$ = createEffect((): any =>
  //   this.actions$.pipe(
  //     ofType(getReportsSuccessAction),
  //     switchMap((_) => {
  //       return this.store.pipe(
  //         select(currentUserSelector),
  //         first(),
  //         map((user) => getCurrentUserInfoAction({ email: user?.email || '' }))
  //       );
  //     })
  //   )
  // );

  getReportsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getReportsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private messageService: MessageService
  ) {}
}
