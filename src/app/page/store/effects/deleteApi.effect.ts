import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import {
  deleteApiAction,
  deleteApiSuccessAction,
  deleteApiFailureAction,
} from '../actions/deleteApi.action';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import { getCurrentUserInfoAction } from '../actions/getCurrentUserInfo.action';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';

@Injectable()
export class DeleteApiEffect {
  deleteApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(deleteApiAction),
      switchMap(({ email, apiId }) => {
        return this.userService.deleteApi(email, apiId).pipe(
          map(({ status, data, errors }) => {
            return status
              ? deleteApiSuccessAction({
                  apiId: data as string,
                })
              : deleteApiFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              deleteApiFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  deleteApiSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(deleteApiSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Api removed successfully',
        });
      }),
      switchMap((_) => {
        return this.store.pipe(
          select(currentUserSelector),
          first(),
          map((user) => getCurrentUserInfoAction({ email: user?.email || '' }))
        );
      })
    )
  );

  deleteApiFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(deleteApiFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store: Store,
    private messageService: MessageService
  ) {}
}
