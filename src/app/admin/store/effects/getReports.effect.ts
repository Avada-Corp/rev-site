import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { showErrors } from 'src/app/page/store/effects/common';
import { UserService } from 'src/app/page/services/user.service';
import {
  getReportsAction,
  getReportsFailureAction,
  getReportsSuccessAction,
  setReportsDateRangeAction,
} from '../actions/getReports.action';

function prepareData({
  allApiPnlReports,
  allApiReports,
  apis,
  usernames,
}: any) {
  const reports: any[] = [];
  for (const api of apis) {
    const keyId = api._id?.valueOf() || null;
    const email: string | null = api.email;
    const { username = email, tgAccount = '' } =
      usernames.find((u: any) => u.email === email) || {};
    const apiReports = allApiPnlReports.filter((a: any) => a.keyId === keyId);
    reports.push(
      ...apiReports.map((r: any) => {
        const nonPnlDbInfo = allApiReports.find(
          (n: any) => n.keyId === keyId && n.to === r.to
        );
        return {
          ...r,
          apiName: api.name,
          username,
          tgAccount,
          transfers: nonPnlDbInfo?.transfers,
          totalBalance: nonPnlDbInfo?.totalBalance,
          api: {
            rev_id: api.rev_id,
            key: api.key,
            botIds: api.botIds,
            market: api.market,
            email,
            isTransferHistoryAvailable: api.isTransferHistoryAvailable,
          },
        };
      })
    );
  }
  return reports;
}

@Injectable()
export class GetReportsEffect {
  getReports$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getReportsAction),
      switchMap(({ start, to }) => {
        return this.userService.getClearPnlReportsWithoutDoubts(start, to).pipe(
          mergeMap(({ status, data, errors }) => {
            if (status) {
              return [
                setReportsDateRangeAction({ fromDate: start, toDate: to }),
                getReportsSuccessAction({
                  reports: data,
                  // .filter((d) => d.apiName === 'ByBit')
                }),
              ];
            } else {
              return [
                getReportsFailureAction({
                  errors: errors || [],
                }),
              ];
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getReportsFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  getReportsFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getReportsFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private messageService: MessageService
  ) {}
}
