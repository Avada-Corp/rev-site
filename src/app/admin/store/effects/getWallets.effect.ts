import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import {
  getWalletsAction,
  getWalletsFailureAction,
  getWalletsSuccessAction,
} from '../actions/getWallets.action';

@Injectable()
export class GetWalletsEffect {
  getWallets$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getWalletsAction),
      switchMap(() => {
        return this.userService.getWallets().pipe(
          map(({ status, data, errors }) => {
            return status
              ? getWalletsSuccessAction({
                  wallets: data,
                })
              : getWalletsFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getWalletsFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getWalletsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getWalletsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private messageService: MessageService
  ) {}
}
