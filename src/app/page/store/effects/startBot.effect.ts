import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of, first } from 'rxjs';

import {
  startBotAction,
  startBotFailureAction,
  startBotSuccessAction,
} from '../actions/startBot.action';
import { UserService } from '../../services/user.service';
import { BotStatus } from 'src/app/shared/types/commonInterfaces';
import { MessageService } from 'primeng/api';
import { showErrors, showInfoMessages } from './common';

@Injectable()
export class StartBotEffect {
  startBot$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(startBotAction),
      switchMap(({ email, apiId }) => {
        return this.userService.startBot(email, apiId).pipe(
          map(({ status, messages, errors }) => {
            return status
              ? startBotSuccessAction({ messages })
              : startBotFailureAction({
                  errors: errors || [],
                });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              startBotFailureAction({
                errors: [errorResponse.error.message],
              })
            );
          })
        );
      })
    )
  );

  startBotSuccess$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(startBotSuccessAction),
        tap(({ messages }) => {
          if (messages) {
            showInfoMessages(messages, this.messageService);
          }
        })
      ),
    { dispatch: false }
  );

  startBotFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(startBotFailureAction),
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
