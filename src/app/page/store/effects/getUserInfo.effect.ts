import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, first } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from '../../services/user.service';
import {
  getCurrentUserInfoAction,
  getCurrentUserInfoFailureAction,
  getCurrentUserInfoSuccessAction,
} from '../actions/getCurrentUserInfo.action';
import { HttpErrorResponse } from '@angular/common/http';
import { BotStatusServer } from 'src/app/shared/types/commonInterfaces';
import { Store, select } from '@ngrx/store';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { getApiStatusesAction } from '../actions/getApiStatuses.action';

@Injectable()
export class GetUserInfoEffect {
  createApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCurrentUserInfoAction),
      switchMap(({ email }) => {
        return this.userService.getUserInfo(email).pipe(
          map(({ data }) =>
            getCurrentUserInfoSuccessAction({
              apiKeys: data.map((d: any) => ({
                ...d,
                status: BotStatusServer[d.status],
              })),
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getCurrentUserInfoFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getUserInfoSuccess$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getCurrentUserInfoSuccessAction),
      switchMap((_) => {
        return this.store.pipe(
          select(currentUserSelector),
          first(),
          map((user) => getApiStatusesAction({ email: user?.email || '' }))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService
  ) {}
}
