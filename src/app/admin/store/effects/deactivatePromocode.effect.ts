import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import {
  deactivatePromocodeAction,
  deactivatePromocodeSuccessAction,
  deactivatePromocodeFailureAction,
} from '../actions/deactivatePromocode.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class DeactivatePromocodeEffect {
  deactivatePromocode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deactivatePromocodeAction),
      switchMap(({ promocodeId }) => {
        return this.adminService.deactivatePromocode(promocodeId).pipe(
          map((response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Промокод отключен',
            });
            return deactivatePromocodeSuccessAction({ promocodeId });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось отключить промокод',
            });
            return of(deactivatePromocodeFailureAction({ errors: error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
