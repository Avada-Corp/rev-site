import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  getUsersAction,
  getUsersFailureAction,
  getUsersSuccessAction,
} from '../actions/users.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class GetUsersEffect {
  users$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getUsersAction),
      switchMap(({ email, page, limit }) => {
        return this.adminService.getUsers(email, page, limit).pipe(
          map(({ status, data, meta }) => {
            if (status && data && meta) {
              console.log('Загружены пользователи с сервера:', {
                total: meta.total,
                page: meta.page,
                limit: meta.limit,
                usersCount: data.length,
                meta,
              });

              return getUsersSuccessAction({ users: data, meta });
            } else {
              return getUsersFailureAction({
                errors: ['Failed to load users'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getUsersFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  getUsersFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getUsersFailureAction),
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
