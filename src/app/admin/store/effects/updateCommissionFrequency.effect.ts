import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  updateCommissionFrequencyAction,
  updateCommissionFrequencyFailureAction,
  updateCommissionFrequencySuccessAction,
} from '../actions/updateCommissionFrequency.action';

@Injectable()
export class UpdateCommissionFrequencyEffect {
  updateCommission$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateCommissionFrequencyAction),
      switchMap(({ email, commissionType }) => {
        return this.adminService
          .updateCommissionFrequency({
            email,
            commissionType,
          })
          .pipe(
            map(({ status, errors }) => {
              return status
                ? updateCommissionFrequencySuccessAction({
                    email,
                    commissionType,
                  })
                : updateCommissionFrequencyFailureAction({
                    errors: errors || [],
                  });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                updateCommissionFrequencyFailureAction({
                  errors: [errorResponse.error.message],
                })
              );
            })
          );
      })
    )
  );

  updateCommissionFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateCommissionFrequencyFailureAction),
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
