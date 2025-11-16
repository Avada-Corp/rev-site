import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import {
  setApiStrategyAction,
  setApiStrategySuccessAction,
  setApiStrategyFailureAction,
} from '../actions/setApiStrategy.action';
import { getUsersAction } from '../actions/users.action';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  defaultLimitValue,
  defaultPageValue,
} from '../../services/controlApi.service';

@Injectable()
export class SetApiStrategyEffect {
  setApiStrategy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setApiStrategyAction),
      switchMap(({ email, apiName, strategyId }) => {
        return this.adminService
          .setApiStrategy(email, apiName, strategyId)
          .pipe(
            map(() => {
              return setApiStrategySuccessAction({
                email,
                apiName,
                strategyId,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                setApiStrategyFailureAction({ error: errorResponse.error })
              );
            })
          );
      })
    )
  );

  setApiStrategySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setApiStrategySuccessAction),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Стратегия API успешно обновлена',
          });
          // Перезапрашиваем список пользователей
          this.store.dispatch(
            getUsersAction({
              email: '',
              page: defaultPageValue,
              limit: defaultLimitValue,
            })
          );
        })
      ),
    { dispatch: false }
  );

  setApiStrategyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setApiStrategyFailureAction),
        tap(({ error }) => {
          const errorMessage =
            error?.message || 'Не удалось обновить стратегию API';
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: errorMessage,
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService,
    private store: Store
  ) {}
}
