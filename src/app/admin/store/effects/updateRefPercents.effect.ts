import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  updateRefPercentsAction,
  updateRefPercentsFailureAction,
  updateRefPercentsSuccessAction,
} from '../actions/updateRefPercents.action';
import { getRefPercentsAction } from '../actions/getRefPercents.action';

@Injectable()
export class UpdateRefPercentEffect {
  getRefPercent$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateRefPercentsAction),
      switchMap(({ email, refPercent1, refPercent2, refPercent3 }) => {
        return this.adminService
          .updateRefPercents(email, {
            refPercent1,
            refPercent2,
            refPercent3,
          })
          .pipe(
            map(({ status, errors }) => {
              return status
                ? updateRefPercentsSuccessAction()
                : updateRefPercentsFailureAction({
                    errors: errors || [],
                  });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                updateRefPercentsFailureAction({
                  errors: [errorResponse.error.message],
                })
              );
            })
          );
      })
    )
  );

  getRefPercentFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateRefPercentsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  getRefPercentSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateRefPercentsSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          life: 5000,
          detail: 'Ref percent updated',
        });
      }),
      switchMap(() => of(getRefPercentsAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
