import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  getUsersCommissionsAction,
  getUsersCommissionsFailureAction,
  getUsersCommissionsSuccessAction,
} from '../actions/getUsersCommissions.action';

@Injectable()
export class GetUsersCommissionsEffect {
  getUsersCommissions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getUsersCommissionsAction),
      switchMap(() => {
        return this.adminService.getUsersCommissions().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getUsersCommissionsSuccessAction({
                  usersCommissions: data,
                })
              : getUsersCommissionsFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getUsersCommissionsFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getUsersCommissionsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getUsersCommissionsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
