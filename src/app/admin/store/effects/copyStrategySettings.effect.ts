import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import {
  copyStrategySettingsAction,
  copyStrategySettingsSuccessAction,
  copyStrategySettingsFailureAction,
} from '../actions/copyStrategySettings.action';
import { getBotsAction } from '../actions/bots.action';
import { MessageService } from 'primeng/api';

@Injectable()
export class CopyStrategySettingsEffect {
  copyStrategySettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(copyStrategySettingsAction),
      switchMap(({ fromStrategyId, toStrategyId }) => {
        return this.adminService
          .copyStrategySettings(fromStrategyId, toStrategyId)
          .pipe(
            map((response: any) => {
              return copyStrategySettingsSuccessAction({
                bots: response.data,
              });
            }),
            catchError(() => {
              alert('Ошибка при копировании настроек стратегии');
              return of(copyStrategySettingsFailureAction());
            })
          );
      })
    )
  );

  copyStrategySettingsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(copyStrategySettingsSuccessAction),
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успех',
          detail: `Настройки стратегии успешно скопированы`,
          life: 3000,
        });
      }),
      map(() => getBotsAction())
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
