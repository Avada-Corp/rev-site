import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  getRefPercentsAction,
  getRefPercentsFailureAction,
  getRefPercentsSuccessAction,
} from '../actions/getRefPercents.action';

@Injectable()
export class GetRefPercentEffect {
  getRefPercent$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getRefPercentsAction),
      switchMap(() => {
        return this.adminService.getRefPercents().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getRefPercentsSuccessAction({
                  refLevels: data,
                })
              : getRefPercentsFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getRefPercentsFailureAction({
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
        ofType(getRefPercentsFailureAction),
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
