import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import {
  getApiCommissionAction,
  getApiCommissionFailureAction,
  getApiCommissionSuccessAction,
} from '../actions/getApiCommission.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class GetCommissionsApiEffect {
  getCommissions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getApiCommissionAction),
      switchMap(() => {
        return this.adminService.getCommissionsApi().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getApiCommissionSuccessAction({
                  commissions: data,
                })
              : getApiCommissionFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getApiCommissionFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getCommissionsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getApiCommissionFailureAction),
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
