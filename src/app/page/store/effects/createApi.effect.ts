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
  createApiAction,
  createApiFailureAction,
  createApiSuccessAction,
} from '../actions/createApi.action';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { getCurrentUserInfoAction } from '../actions/getCurrentUserInfo.action';

@Injectable()
export class CreateApiEffect {
  createApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(createApiAction),
      switchMap(({ request }) => {
        return this.userService.createApi(request).pipe(
          map(({ status, data, errors }) => {
            return status
              ? createApiSuccessAction({
                  id: data as string,
                  email: request.email,
                })
              : createApiFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              createApiFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  createApiSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(createApiSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Api created successfully',
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

  createApiFailure$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(createApiFailureAction),
      tap(({ errors }) => showErrors(errors, this.messageService)),
      switchMap((_) => {
        return this.store.pipe(
          select(currentUserSelector),
          first(),
          map((user) => getCurrentUserInfoAction({ email: user?.email || '' }))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store: Store,
    private messageService: MessageService
  ) {}
}
