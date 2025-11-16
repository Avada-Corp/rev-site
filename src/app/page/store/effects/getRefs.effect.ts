import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from '../../../shared/shared-components/store/effects/common';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/page/services/user.service';
import {
  getRefsAction,
  getRefsFailureAction,
  getRefsSuccessAction,
} from '../actions/getRefs.action';

@Injectable()
export class GetRefsEffect {
  getRefs$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getRefsAction),
      switchMap(({ accountId }) => {
        return this.userService.getRefs(accountId).pipe(
          map(({ status, data, errors }) => {
            return status
              ? getRefsSuccessAction({
                  refs: data,
                })
              : getRefsFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getRefsFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getRefsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getRefsFailureAction),
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
