import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import {
  getEmptyUsersAction,
  getEmptyUsersFailureAction,
  getEmptyUsersSuccessAction,
} from '../actions/getEmptyUsers.action';

@Injectable()
export class GetEmptyUsersEffect {
  getEmptyUsers$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getEmptyUsersAction),
      switchMap(() => {
        return this.userService.getEmptyUsers().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getEmptyUsersSuccessAction({
                  users: data,
                })
              : getEmptyUsersFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getEmptyUsersFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getEmptyUsersFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getEmptyUsersFailureAction),
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
