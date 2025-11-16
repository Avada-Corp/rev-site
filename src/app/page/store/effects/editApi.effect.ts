import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, first } from 'rxjs';

import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { showErrors } from './common';
import {
  editApiAction,
  editApiFailureAction,
  editApiSuccessAction,
} from '../actions/editApi.action';
import { getCurrentUserInfoAction } from '../actions/getCurrentUserInfo.action';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';

@Injectable()
export class EditApiEffect {
  editApi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(editApiAction),
      switchMap(({ request }) => {
        return this.userService.editApi(request).pipe(
          map(({ status, data, errors }) => {
            return status
              ? editApiSuccessAction({
                  apiId: data as string,
                })
              : editApiFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              editApiFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  editApiSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(editApiSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Api edited successfully',
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

  editApiFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(editApiFailureAction),
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
