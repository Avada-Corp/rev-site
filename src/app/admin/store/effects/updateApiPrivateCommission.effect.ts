import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  updateApiPrivateCommissionAction,
  updateApiPrivateCommissionFailureAction,
  updateApiPrivateCommissionSuccessAction,
} from '../actions/updateApiPrivateCommission.action';
import { getApiCommissionAction } from '../actions/getApiCommission.action';

@Injectable()
export class UpdateApiPrivateCommissionEffect {
  updatePrivateCommissions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateApiPrivateCommissionAction),
      switchMap(({ apiKey, percent, absolute }) => {
        return this.adminService
          .updatePrivateApiCommission(apiKey, percent, absolute)
          .pipe(
            map(({ status, errors }) => {
              return status
                ? updateApiPrivateCommissionSuccessAction()
                : updateApiPrivateCommissionFailureAction({
                    errors: errors || [],
                  });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                updateApiPrivateCommissionFailureAction({
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
        ofType(updateApiPrivateCommissionFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updatePrivateCommissionsSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateApiPrivateCommissionSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Commission updated',
        });
      }),
      switchMap(() => of(getApiCommissionAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
