import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { showErrors } from 'src/app/page/store/effects/common';
import { MessageService } from 'primeng/api';
import {
  getCommissionTextAction,
  getCommissionTextFailureAction,
  getCommissionTextSuccessAction,
  saveCommissionTextAction,
  saveCommissionTextFailureAction,
  saveCommissionTextSuccessAction,
  getScenesAction,
  getScenesFailureAction,
  getScenesSuccessAction,
  saveScenesAction,
  saveScenesFailureAction,
  saveScenesSuccessAction,
  updateSceneAction,
  updateSceneFailureAction,
  updateSceneSuccessAction,
  createSceneAction,
  createSceneFailureAction,
  createSceneSuccessAction,
  deleteSceneAction,
  deleteSceneFailureAction,
  deleteSceneSuccessAction,
} from '../actions/settings.actions';
import { AdminService } from '../../services/admin.service';

@Injectable()
export class SettingsEffect {
  getCommissionText$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getCommissionTextAction),
      switchMap(() => {
        return this.adminService.getCommissionText().pipe(
          map(({ status, data }) => {
            if (status && data !== undefined) {
              return getCommissionTextSuccessAction({ texts: data });
            } else {
              return getCommissionTextFailureAction({
                errors: ['Failed to load commission text'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getCommissionTextFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to load commission text',
                ],
              })
            );
          })
        );
      })
    )
  );

  saveCommissionText$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(saveCommissionTextAction),
      switchMap(({ text, lang }) => {
        return this.adminService.saveCommissionText(text, lang).pipe(
          map(({ status, data }) => {
            if (status && data) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Текст комиссии сохранен',
              });
              return saveCommissionTextSuccessAction({ texts: data });
            } else {
              return saveCommissionTextFailureAction({
                errors: ['Failed to save commission text'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              saveCommissionTextFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to save commission text',
                ],
              })
            );
          })
        );
      })
    )
  );

  getCommissionTextFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getCommissionTextFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  saveCommissionTextFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(saveCommissionTextFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  getScenes$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getScenesAction),
      switchMap(() => {
        return this.adminService.getScenes().pipe(
          map(({ status, data }) => {
            if (status && data !== undefined) {
              return getScenesSuccessAction({ scenes: data });
            } else {
              return getScenesFailureAction({
                errors: ['Failed to load scenes'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              getScenesFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to load scenes',
                ],
              })
            );
          })
        );
      })
    )
  );

  saveScenes$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(saveScenesAction),
      switchMap(({ scenes }) => {
        return this.adminService.saveScenes(scenes).pipe(
          map(({ status, data }) => {
            if (status && data) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Сцены сохранены',
              });
              return saveScenesSuccessAction({ scenes: data });
            } else {
              return saveScenesFailureAction({
                errors: ['Failed to save scenes'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              saveScenesFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to save scenes',
                ],
              })
            );
          })
        );
      })
    )
  );

  getScenesFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(getScenesFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  saveScenesFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(saveScenesFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  updateScene$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(updateSceneAction),
      switchMap(({ scene }) => {
        return this.adminService.updateScene(scene).pipe(
          map(({ status, data }) => {
            if (status && data) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Сцена обновлена',
              });
              return updateSceneSuccessAction({ scene: data });
            } else {
              return updateSceneFailureAction({
                errors: ['Failed to update scene'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              updateSceneFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to update scene',
                ],
              })
            );
          })
        );
      })
    )
  );

  updateSceneFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(updateSceneFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  createScene$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(createSceneAction),
      switchMap(({ scene }) => {
        return this.adminService.createScene(scene).pipe(
          map(({ status, data }) => {
            if (status && data) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Сцена создана',
              });
              return createSceneSuccessAction({ scene: data });
            } else {
              return createSceneFailureAction({
                errors: ['Failed to create scene'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              createSceneFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to create scene',
                ],
              })
            );
          })
        );
      })
    )
  );

  createSceneFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(createSceneFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  deleteScene$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(deleteSceneAction),
      switchMap(({ sceneId }) => {
        return this.adminService.deleteScene(sceneId).pipe(
          map(({ status }) => {
            if (status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Сцена удалена',
              });
              return deleteSceneSuccessAction({ sceneId });
            } else {
              return deleteSceneFailureAction({
                errors: ['Failed to delete scene'],
              });
            }
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              deleteSceneFailureAction({
                errors: errorResponse.error.message || [
                  'Failed to delete scene',
                ],
              })
            );
          })
        );
      })
    )
  );

  deleteSceneFailure$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(deleteSceneFailureAction),
        tap(({ errors }) => showErrors(errors, this.messageService))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private messageService: MessageService
  ) {}
}
