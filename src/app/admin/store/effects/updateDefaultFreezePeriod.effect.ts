import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import {
  updateDefaultFreezePeriodAction,
  updateDefaultFreezePeriodSuccessAction,
  updateDefaultFreezePeriodFailureAction,
  getDefaultFreezePeriodAction,
  getDefaultFreezePeriodSuccessAction,
  getDefaultFreezePeriodFailureAction,
} from '../actions/updateDefaultFreezePeriod.action';

@Injectable()
export class UpdateDefaultFreezePeriodEffect {
  updateDefaultFreezePeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDefaultFreezePeriodAction),
      switchMap(({ freezePeriod }) =>
        this.adminService.updateDefaultFreezePeriod(freezePeriod).pipe(
          map(() => updateDefaultFreezePeriodSuccessAction({ freezePeriod })),
          catchError((error) =>
            of(updateDefaultFreezePeriodFailureAction({ error }))
          )
        )
      )
    )
  );

  getDefaultFreezePeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDefaultFreezePeriodAction),
      switchMap(() =>
        this.adminService.getDefaultFreezePeriod().pipe(
          map(({ data }) =>
            getDefaultFreezePeriodSuccessAction({ freezePeriod: data })
          ),
          catchError((error) =>
            of(getDefaultFreezePeriodFailureAction({ error }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private adminService: AdminService) {}
}
