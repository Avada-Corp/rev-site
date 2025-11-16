import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import {
  activatePromocodeAction,
  activatePromocodeSuccessAction,
  activatePromocodeFailureAction,
} from '../actions/activatePromocode.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class ActivatePromocodeEffect {
  activatePromocode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activatePromocodeAction),
      switchMap(({ promocodeId }) => {
        return this.adminService.activatePromocode(promocodeId).pipe(
          map((response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Промокод активирован',
            });
            return activatePromocodeSuccessAction({ promocodeId });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось активировать промокод',
            });
            return of(activatePromocodeFailureAction({ errors: error }));
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
