import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AdminService } from '../../services/admin.service';
import { HttpCancelService } from 'src/app/http-cancel.service';
import { MessageService } from 'primeng/api';
import {
  generatePromocodesAction,
  generatePromocodesSuccessAction,
  generatePromocodesFailureAction,
} from '../actions/generatePromocodes.action';
import { requestCancelledAction } from '../actions/requestCancelled.action';

@Injectable()
export class GeneratePromocodesEffect {
  generatePromocodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(generatePromocodesAction),
      switchMap(({ request }) => {
        return this.adminService.generatePromocodes(request).pipe(
          takeUntil(this.httpCancelService.onCancelPendingRequests()),
          map((response: any) => {
            if (response.status) {
              return generatePromocodesSuccessAction({
                promocodes: response.data,
              });
            } else {
              return generatePromocodesFailureAction({
                error: response.message || 'Ошибка генерации промокодов',
              });
            }
          }),
          catchError((error) => {
            if (error.name === 'AbortError') {
              return of(requestCancelledAction());
            }
            return of(
              generatePromocodesFailureAction({
                error: error.message || 'Ошибка генерации промокодов',
              })
            );
          })
        );
      })
    )
  );

  generatePromocodesSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(generatePromocodesSuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: 'Промокоды сгенерированы',
          });
        })
      ),
    { dispatch: false }
  );

  generatePromocodesFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(generatePromocodesFailureAction),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error,
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private httpCancelService: HttpCancelService,
    private messageService: MessageService
  ) {}
}
