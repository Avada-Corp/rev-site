import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  bulkUpdateBotsAction,
  bulkUpdateBotsFailureAction,
  bulkUpdateBotsSuccessAction,
} from '../actions/bulkUpdateBots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class BulkUpdateBotsEffect {
  bulkUpdateBots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(bulkUpdateBotsAction),
      switchMap(({ apiKeys }) => {
        return this.adminService.bulkUpdateBots(apiKeys).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return bulkUpdateBotsSuccessAction({
                processedCount: data.processedCount,
                totalCount: data.totalCount,
              });
            } else {
              return bulkUpdateBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              bulkUpdateBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  bulkUpdateBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkUpdateBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  bulkUpdateBotsSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkUpdateBotsSuccessAction),
        tap(({ processedCount, totalCount }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            life: 5000,
            detail: `Массовое обновление завершено: ${processedCount}/${totalCount} API ключей обработано`,
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
