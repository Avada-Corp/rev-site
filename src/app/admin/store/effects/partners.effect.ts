import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from 'src/environments/environment';
import {
  getPartnersAction,
  getPartnersSuccessAction,
  getPartnersFailureAction,
  createPartnerAction,
  createPartnerSuccessAction,
  createPartnerFailureAction,
  updatePartnerAction,
  updatePartnerSuccessAction,
  updatePartnerFailureAction,
  deletePartnerAction,
  deletePartnerSuccessAction,
  deletePartnerFailureAction,
} from '../actions/partners.action';
import {
  Partner,
  PartnersResponse,
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from '../types/adminState.interface';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class PartnersEffect {
  constructor(private actions$: Actions, private adminService: AdminService) {}

  getPartners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPartnersAction),
      switchMap(() => {
        return this.adminService.getPartners().pipe(
          map((response: PartnersResponse) => {
            return getPartnersSuccessAction({ partners: response.data });
          }),
          catchError((errorResponse) => {
            return of(
              getPartnersFailureAction({ errors: errorResponse.error.errors })
            );
          })
        );
      })
    )
  );

  createPartner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPartnerAction),
      switchMap(({ partnerData }) => {
        return this.adminService.createPartner(partnerData).pipe(
          map((response: { status: boolean; data: Partner }) => {
            return createPartnerSuccessAction({ partner: response.data });
          }),
          catchError((errorResponse) => {
            return of(
              createPartnerFailureAction({ errors: errorResponse.error.errors })
            );
          })
        );
      })
    )
  );

  updatePartner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePartnerAction),
      switchMap(({ partnerData }) => {
        return this.adminService.updatePartner(partnerData).pipe(
          map((response: { status: boolean; data: Partner }) => {
            return updatePartnerSuccessAction({ partner: response.data });
          }),
          catchError((errorResponse) => {
            return of(
              updatePartnerFailureAction({ errors: errorResponse.error.errors })
            );
          })
        );
      })
    )
  );

  deletePartner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePartnerAction),
      switchMap(({ partnerId }) => {
        return this.adminService.deletePartner(partnerId).pipe(
          map(() => {
            return deletePartnerSuccessAction({ partnerId });
          }),
          catchError((errorResponse) => {
            return of(
              deletePartnerFailureAction({ errors: errorResponse.error.errors })
            );
          })
        );
      })
    )
  );
}
