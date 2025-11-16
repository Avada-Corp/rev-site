import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import {
  getSoloPnlReportsAction,
  getSoloPnlReportsFailureAction,
  getSoloPnlReportsSuccessAction,
} from '../actions/getSoloPnlReports.action';

@Injectable()
export class GetSoloPnlReportsEffect {
  getSoloPnlReports$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getSoloPnlReportsAction),
      switchMap(({ from, to, email: username }) => {
        return this.userService
          .getSoloPnlReportsWithoutDoubts(from, to, username)
          .pipe(
            map(({ status, data, errors }) => {
              return status
                ? getSoloPnlReportsSuccessAction({
                    reports: data || [],
                    email: username,
                  })
                : getSoloPnlReportsFailureAction({
                    errors: errors || [],
                  });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                getSoloPnlReportsFailureAction({
                  errors: [errorResponse.error.message],
                })
              );
            })
          );
      })
    )
  );

  getSoloPnlReportsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getSoloPnlReportsFailureAction),
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
