import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  getBotStrategiesFailureAction,
  getBotStrategiesAction,
  getBotStrategiesSuccessAction,
  editBotStrategyAction,
  editBotStrategySuccessAction,
  editBotStrategyFailureAction,
} from '../actions/botStrategies.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class GetBotStrategiesEffect {
  botStrategies$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getBotStrategiesAction),
      switchMap(() => {
        return this.adminService.getBotStrategies().pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return getBotStrategiesSuccessAction({
                botStrategies: data,
              });
            } else {
              return getBotStrategiesFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getBotStrategiesFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  getBotStrategiesFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getBotStrategiesFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  editBotStrategy$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(editBotStrategyAction),
      switchMap(
        ({
          strategyId,
          name,
          nameEn,
          description,
          descriptionEn,
          minDeposit,
          actualLeverage,
          isSpot,
        }) => {
          const payload = {
            strategyId,
            name,
            nameEn,
            description,
            descriptionEn,
            minDeposit,
            actualLeverage,
            isSpot,
          };
          console.log('editBotStrategy$ payload:', payload);
          
          return this.adminService
            .editBotStrategy(payload)
            .pipe(
            map(({ status, data, errors }) => {
              if (status && data) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Успешно',
                  detail: 'Стратегия обновлена',
                });
                return editBotStrategySuccessAction({ strategy: data });
              } else {
                return editBotStrategyFailureAction({
                  errors: errors || ['Не удалось обновить стратегию'],
                });
              }
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                editBotStrategyFailureAction({
                  errors: errorResponse.error?.message || [
                    'Ошибка при обновлении стратегии',
                  ],
                })
              );
            })
          );
        }
      )
    )
  );

  editBotStrategyFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(editBotStrategyFailureAction),
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
