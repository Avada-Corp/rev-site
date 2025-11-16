import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  addReferralAction,
  addReferralFailureAction,
  addReferralSuccessAction,
} from '../actions/addReferral.action';

@Injectable()
export class AddReferralEffect {
  addReferral$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(addReferralAction),
      switchMap(({ email, refId }) => {
        return this.authService.addReferral(email, refId).pipe(
          map((isAdded) => {
            if (isAdded) {
              return addReferralSuccessAction({ isAdded });
            } else {
              return addReferralFailureAction({ errors: ['unknown error'] });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              addReferralFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  addRefferalFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addReferralFailureAction),
        tap(({ errors }) => console.error(errors))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
