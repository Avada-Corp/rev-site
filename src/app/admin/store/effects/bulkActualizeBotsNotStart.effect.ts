import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  bulkActualizeBotsNotStartAction,
  bulkActualizeBotsNotStartFailureAction,
  bulkActualizeBotsNotStartSuccessAction,
} from '../actions/bulkActualizeBotsNotStart.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class BulkActualizeBotsNotStartEffect {
  bulkActualizeBotsNotStart$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(bulkActualizeBotsNotStartAction),
      switchMap(({ apiKeys }) => {
        return this.adminService.bulkActualizeBotsNotStart(apiKeys).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return bulkActualizeBotsNotStartSuccessAction({
                processedCount: data.processedCount,
                totalCount: data.totalCount,
              });
            } else {
              return bulkActualizeBotsNotStartFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              bulkActualizeBotsNotStartFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  bulkActualizeBotsNotStartFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkActualizeBotsNotStartFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  bulkActualizeBotsNotStartSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkActualizeBotsNotStartSuccessAction),
        tap(({ processedCount, totalCount }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            life: 5000,
            detail: `Массовая актуализация без старта завершена: ${processedCount}/${totalCount} API ключей обработано`,
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
