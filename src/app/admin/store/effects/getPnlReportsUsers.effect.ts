import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import {
  getPnlReportsUsersAction,
  getPnlReportsUsersFailureAction,
  getPnlReportsUsersSuccessAction,
} from '../actions/getPnlReportsUsers.action';
import { setReportsDateRangeAction } from '../actions/getReports.action';

@Injectable()
export class GetPnlReportsUsersEffect {
  getPnlReportsUsers$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getPnlReportsUsersAction),
      switchMap(({ start, to }) => {
        return this.userService.getPnlReportsUsers(start, to).pipe(
          mergeMap(({ status, data, errors }) => {
            if (status) {
              return [
                setReportsDateRangeAction({ fromDate: start, toDate: to }),
                getPnlReportsUsersSuccessAction({
                  users: data || [],
                }),
              ];
            } else {
              return [
                getPnlReportsUsersFailureAction({
                  errors: errors || [],
                }),
              ];
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getPnlReportsUsersFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getPnlReportsUsersFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getPnlReportsUsersFailureAction),
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
