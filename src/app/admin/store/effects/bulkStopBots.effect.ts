import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  bulkStopBotsAction,
  bulkStopBotsFailureAction,
  bulkStopBotsSuccessAction,
} from '../actions/bulkStopBots.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class BulkStopBotsEffect {
  bulkStopBots$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(bulkStopBotsAction),
      switchMap(({ apiKeys }) => {
        return this.adminService.bulkStopBots(apiKeys).pipe(
          map(({ status, data, errors }) => {
            if (status) {
              return bulkStopBotsSuccessAction({
                processedCount: data.processedCount,
                totalCount: data.totalCount,
              });
            } else {
              return bulkStopBotsFailureAction({
                errors: errors,
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              bulkStopBotsFailureAction({
                errors: errorResponse.error.message,
              })
            );
          })
        );
      })
    )
  );

  bulkStopBotsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkStopBotsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  bulkStopBotsSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(bulkStopBotsSuccessAction),
        tap(({ processedCount, totalCount }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            life: 5000,
            detail: `Массовая остановка завершена: ${processedCount}/${totalCount} API ключей обработано`,
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
