import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, first } from 'rxjs';

import {
  fullStopBotAction,
  fullStopBotFailureAction,
  fullStopBotSuccessAction,
} from '../actions/fullStopBot.action';
import { UserService } from '../../services/user.service';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { MessageService } from 'primeng/api';
import { showErrors, showInfoMessages } from './common';

@Injectable()
export class FullStopBotEffect {
  fullStopBot$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(fullStopBotAction),
      switchMap(({ email, apiId }) => {
        return this.userService.fullStopBot(email, apiId).pipe(
          map(({ status, messages, errors }) => {
            return status
              ? fullStopBotSuccessAction({ messages })
              : fullStopBotFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              fullStopBotFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  fullStopBotSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(fullStopBotSuccessAction),
        tap(({ messages }) => {
          messages = [
            'Все ордера отменены. Позиции необходимо закрыть вручную',
            ...(messages ?? []),
          ];
          showInfoMessages(messages, this.messageService);
        })
      ),
    { dispatch: false }
  );

  fullStopBotFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(fullStopBotFailureAction),
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
