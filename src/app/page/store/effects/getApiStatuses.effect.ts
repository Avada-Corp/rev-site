import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from '../../services/user.service';
import {
  getApiStatusesAction,
  getApiStatusesFailureAction,
  getApiStatusesSuccessAction,
} from '../actions/getApiStatuses.action';
import { HttpErrorResponse } from '@angular/common/http';
import { BotStatusServer } from 'src/app/shared/types/commonInterfaces';

@Injectable()
export class GetApiStatusesEffect {
  getApiStatusesApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getApiStatusesAction),
      switchMap(({ email }) => {
        return this.userService.getAllStatuses(email).pipe(
          map(({ data }) =>
            getApiStatusesSuccessAction({
              apiKeys: data,
            })
          ),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getApiStatusesFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
