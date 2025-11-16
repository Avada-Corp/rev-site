import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AdminService } from '../../services/admin.service';
import {
  updateParentRefAction,
  updateParentRefSuccessAction,
  updateParentRefFailureAction,
} from '../actions/updateParentRef.action';
import { getUsersAction } from '../actions/users.action';
import { MessageService } from 'primeng/api';
import {
  defaultLimitValue,
  defaultPageValue,
} from '../../services/controlApi.service';

@Injectable()
export class UpdateParentRefEffect {
  updateParentRef$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateParentRefAction),
      switchMap(({ email, parentRef }) => {
        return this.adminService.updateParentRef(email, parentRef).pipe(
          map(({ status, messages }) => {
            if (status) {
              return updateParentRefSuccessAction({
                messages,
              });
            } else {
              return updateParentRefFailureAction({
                errors: messages,
              });
            }
          }),
          catchError((errorResponse) => {
            return of(
              updateParentRefFailureAction({
                errors: errorResponse.error.errors,
              })
            );
          })
        );
      })
    )
  );

  updateParentRefSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateParentRefSuccessAction),
      map(({ messages }) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Успешно',
          detail: messages[0],
        });
        return getUsersAction({
          email: '',
          page: defaultPageValue,
          limit: defaultLimitValue,
        });
      })
    )
  );

  updateParentRefFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateParentRefFailureAction),
        map(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: errors[0],
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
