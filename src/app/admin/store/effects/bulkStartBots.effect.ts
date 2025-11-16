import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  bulkStartBotsAction,
  bulkStartBotsFailureAction,
  bulkStartBotsSuccessAction,
} from '../actions/bulkStartBots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class BulkStartBotsEffect {
  bulkStartBots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(bulkStartBotsAction),
      switchMap(({ apiKeys }) => {
        return this.adminService.bulkStartBots(apiKeys).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return bulkStartBotsSuccessAction({
                processedCount: data.processedCount,
                totalCount: data.totalCount,
              });
            } else {
              return bulkStartBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              bulkStartBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  bulkStartBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkStartBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  bulkStartBotsSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkStartBotsSuccessAction),
        tap(({ processedCount, totalCount }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            life: 5000,
            detail: `Массовый запуск завершен: ${processedCount}/${totalCount} API ключей обработано`,
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
