import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  getUserCommissionAction,
  getUserCommissionFailureAction,
  getUserCommissionSuccessAction,
} from '../actions/getUserCommission.action';

@Injectable()
export class GetCommissionsUserEffect {
  getCommissions$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getUserCommissionAction),
      switchMap(({ to }) => {
        return this.adminService.getCommissionsUser(to).pipe(
          map(({ status, data, errors }) => {
            return status
              ? getUserCommissionSuccessAction({
                  commissions: data,
                })
              : getUserCommissionFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getUserCommissionFailureAction({
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
        ofType(getUserCommissionFailureAction),
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
