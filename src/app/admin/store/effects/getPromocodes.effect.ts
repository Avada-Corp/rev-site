import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import { AdminService } from '../../services/admin.service';
import { HttpCancelService } from 'src/app/http-cancel.service';
import {
  getPromocodesAction,
  getPromocodesSuccessAction,
  getPromocodesFailureAction,
} from '../actions/getPromocodes.action';
import { requestCancelledAction } from '../actions/requestCancelled.action';

@Injectable()
export class GetPromocodesEffect {
  getPromocodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPromocodesAction),
      switchMap(() => {
        return this.adminService.getPromocodes().pipe(
          takeUntil(this.httpCancelService.onCancelPendingRequests()),
          map((response: any) => {
            if (response.status) {
              return getPromocodesSuccessAction({ promocodes: response.data });
            } else {
              return getPromocodesFailureAction({
                error: response.message || 'Ошибка загрузки промокодов',
              });
            }
          }),
          catchError((error) => {
            if (error.name === 'AbortError') {
              return of(requestCancelledAction());
            }
            return of(
              getPromocodesFailureAction({
                error: error.message || 'Ошибка загрузки промокодов',
              })
            );
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private httpCancelService: HttpCancelService
  ) {}
}
