import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import {
  deletePromocodeAction,
  deletePromocodeSuccessAction,
  deletePromocodeFailureAction,
} from '../actions/deletePromocode.action';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class DeletePromocodeEffect {
  deletePromocode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePromocodeAction),
      switchMap(({ promocodeId }) => {
        return this.adminService.deletePromocode(promocodeId).pipe(
          map((response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: 'Промокод удален',
            });
            return deletePromocodeSuccessAction({ promocodeId });
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Не удалось удалить промокод',
            });
            return of(deletePromocodeFailureAction({ errors: error }));
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
