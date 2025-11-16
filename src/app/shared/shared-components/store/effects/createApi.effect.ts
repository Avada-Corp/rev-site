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
  addExistingApiAction,
  addExistingApiSuccessAction,
  addExistingApiFailureAction,
} from '../actions/addExistingApi.action';
import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { UserService } from 'src/app/page/services/user.service';
import { getCurrentUserInfoAction } from 'src/app/page/store/actions/getCurrentUserInfo.action';

@Injectable()
export class AddExistingApiEffect {
  addExistingApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(addExistingApiAction),
      switchMap(({ request }) => {
        return this.userService.addExistingApi(request).pipe(
          map(({ status, data, errors }) => {
            return status
              ? addExistingApiSuccessAction({
                  id: data as string,
                  email: request.email,
                })
              : addExistingApiFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              addExistingApiFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  addExistingApiSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(addExistingApiSuccessAction),
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

  addExistingApiFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(addExistingApiFailureAction),
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
