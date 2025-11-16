import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  bulkActualizeBotsAction,
  bulkActualizeBotsFailureAction,
  bulkActualizeBotsSuccessAction,
} from '../actions/bulkActualizeBots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class BulkActualizeBotsEffect {
  bulkActualizeBots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(bulkActualizeBotsAction),
      switchMap(({ apiKeys }) => {
        return this.adminService.bulkActualizeBots(apiKeys).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return bulkActualizeBotsSuccessAction({
                processedCount: data.processedCount,
                totalCount: data.totalCount,
              });
            } else {
              return bulkActualizeBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              bulkActualizeBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  bulkActualizeBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkActualizeBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  bulkActualizeBotsSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkActualizeBotsSuccessAction),
        tap(({ processedCount, totalCount }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            life: 5000,
            detail: `Массовая актуализация завершена: ${processedCount}/${totalCount} API ключей обработано`,
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
