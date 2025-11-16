import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  updateUserPrivateCommissionAction,
  updateUserPrivateCommissionFailureAction,
  updateUserPrivateCommissionSuccessAction,
} from '../actions/updateUserPrivateCommission.action';
import { getUserCommissionAction } from '../actions/getUserCommission.action';

@Injectable()
export class UpdateUserPrivateCommissionEffect {
  updatePrivateCommissions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateUserPrivateCommissionAction),
      switchMap(({ email, percent, absolute }) => {
        return this.adminService
          .updatePrivateUserCommission(email, percent, absolute)
          .pipe(
            map(({ status, errors }) => {
              return status
                ? updateUserPrivateCommissionSuccessAction()
                : updateUserPrivateCommissionFailureAction({
                    errors: errors || [],
                  });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                updateUserPrivateCommissionFailureAction({
                  errors: [errorResponse.error.message],
                })
              );
            })
          );
      })
    )
  );

  updatePrivateCommissionsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateUserPrivateCommissionFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updatePrivateCommissionsSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateUserPrivateCommissionSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Commission updated',
        });
      }),
      switchMap(() => of(getUserCommissionAction({ to: new Date().getTime() })))
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
