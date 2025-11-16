import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';

import { AdminService } from '../../services/admin.service';
import { HttpCancelService } from 'src/app/http-cancel.service';
import {
  getUsernamesAction,
  getUsernamesSuccessAction,
  getUsernamesFailureAction,
} from '../actions/getUsernames.action';
import { requestCancelledAction } from '../actions/requestCancelled.action';

@Injectable()
export class GetUsernamesEffect {
  getUsernames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsernamesAction),
      switchMap(() => {
        return this.adminService.getUsernames().pipe(
          takeUntil(this.httpCancelService.onCancelPendingRequests()),
          map((response: any) => {
            if (response.status && response.data) {
              // Преобразуем данные пользователей в нужный формат
              const usernames = response.data.map((user: any) => ({
                email: user.email,
                username: user.username,
                _id: user._id || null,
                tgAccount: user.tgAccount || null,
                parentRef: user.parentRef || null,
              }));

              return getUsernamesSuccessAction({ usernames });
            } else {
              return getUsernamesFailureAction({
                errors: response.errors || ['Ошибка загрузки пользователей'],
              });
            }
          }),
          catchError((error) => {
            if (error.name === 'AbortError') {
              return of(requestCancelledAction());
            }
            return of(
              getUsernamesFailureAction({
                errors: [error.message || 'Ошибка загрузки пользователей'],
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
