import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, first } from 'rxjs';

import {
  stopBotAction,
  stopBotFailureAction,
  stopBotSuccessAction,
} from '../actions/stopBot.action';
import { UserService } from '../../services/user.service';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { MessageService } from 'primeng/api';
import { showErrors, showInfoMessages } from './common';

@Injectable()
export class StopBotEffect {
  stopBot$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(stopBotAction),
      switchMap(({ email, apiId }) => {
        return this.userService.stopBot(email, apiId).pipe(
          map(({ status, messages, errors }) => {
            return status
              ? stopBotSuccessAction({ messages })
              : stopBotFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              stopBotFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  stopBotSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(stopBotSuccessAction),
        tap(({ messages }) => {
          messages = [
            'Для остановки необходимо дождаться завершения всех циклов. Новых запускаться не будет',
            ...(messages ?? []),
          ];
          showInfoMessages(messages, this.messageService);
        })
      ),
    { dispatch: false }
  );

  stopBotFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(stopBotFailureAction),
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
