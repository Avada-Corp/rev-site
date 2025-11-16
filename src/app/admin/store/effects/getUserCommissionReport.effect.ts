import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { MessageService } from 'primeng/api';
import {
  getUserCommissionReportAction,
  getUserCommissionReportSuccessAction,
  getUserCommissionReportFailureAction,
} from '../actions/getUserCommissionReport.action';

@Injectable()
export class GetUserCommissionReportEffect {
  getUserCommissionReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserCommissionReportAction),
      switchMap(({ email }) =>
        this.adminService.getUserCommissionReport(email).pipe(
          map((response) => {
            if (response.status && response.data) {
              return getUserCommissionReportSuccessAction({
                email,
                reportData: response.data,
              });
            } else {
              return getUserCommissionReportFailureAction({
                errors: ['Не удалось получить отчет'],
              });
            }
          }),
          catchError((error) => {
            console.error('Ошибка при загрузке отчета:', error);
            return of(
              getUserCommissionReportFailureAction({
                errors: ['Ошибка при загрузке отчета'],
              })
            );
          })
        )
      )
    )
  );

  // Effect для показа уведомления об успешной загрузке
  showSuccessNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getUserCommissionReportSuccessAction),
        tap(({ email }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Успех',
            detail: `Отчет для пользователя ${email} успешно загружен`,
            life: 3000,
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
