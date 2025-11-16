import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';
import {
  updateUserRoleAction,
  updateUserRoleSuccessAction,
  updateUserRoleFailureAction,
} from '../actions/updateUserRole.action';
import { requestCancelledAction } from '../actions/requestCancelled.action';

@Injectable()
export class UpdateUserRoleEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService,
    private store: Store
  ) {}

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserRoleAction),
      switchMap(({ email, role }) => {
        return this.adminService.updateUserRole(email, role).pipe(
          map((response) => {
            if (response.status) {
              return updateUserRoleSuccessAction({ message: 'Role updated' });
            }
            return updateUserRoleFailureAction({
              errors: response.errors || ['Unknown error'],
            });
          }),
          catchError((error) => {
            // Check cancelled
            if (error?.name === 'CanceledError') {
              return of(requestCancelledAction());
            }
            return of(
              updateUserRoleFailureAction({
                errors: [error.message || 'Network error'],
              })
            );
          })
        );
      })
    )
  );

  success$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserRoleSuccessAction),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
          });
        })
      ),
    { dispatch: false }
  );

  failure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserRoleFailureAction),
        tap(({ errors }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errors?.[0] || 'Unable to update role',
          });
        })
      ),
    { dispatch: false }
  );
}
