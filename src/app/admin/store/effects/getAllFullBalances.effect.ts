import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { AdminService } from '../../services/admin.service';
import {
  getAllFullBalancesAction,
  getAllFullBalancesFailureAction,
  getAllFullBalancesSuccessAction,
} from '../actions/getAllFullBalances.action';

@Injectable()
export class GetAllFullBalancesEffect {
  getAllFullBalances$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getAllFullBalancesAction),
      switchMap(() => {
        return this.adminService.getAllFullBalances().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getAllFullBalancesSuccessAction({
                  balances: data,
                })
              : getAllFullBalancesFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getAllFullBalancesFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getAllFullBalancesFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getAllFullBalancesFailureAction),
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
