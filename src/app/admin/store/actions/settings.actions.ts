import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { Lang } from 'src/app/shared/types/lang.enum';
import { ActionTypes } from '../actionTypes';
import { Scene, SceneWithPreview } from '../types/adminState.interface';

export const getCommissionTextAction = createAction(
  ActionTypes.GET_COMMISSION_TEXT
);

export const getCommissionTextSuccessAction = createAction(
  ActionTypes.GET_COMMISSION_TEXT_SUCCESS,
  props<{ texts: { ru: string; en: string } }>()
);

export const getCommissionTextFailureAction = createAction(
  ActionTypes.GET_COMMISSION_TEXT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const saveCommissionTextAction = createAction(
  ActionTypes.SAVE_COMMISSION_TEXT,
  props<{ text: string; lang: Lang }>()
);

export const saveCommissionTextSuccessAction = createAction(
  ActionTypes.SAVE_COMMISSION_TEXT_SUCCESS,
  props<{ texts: { ru: string; en: string } }>()
);

export const saveCommissionTextFailureAction = createAction(
  ActionTypes.SAVE_COMMISSION_TEXT_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Scenes actions
export const getScenesAction = createAction(ActionTypes.GET_SCENES);

export const getScenesSuccessAction = createAction(
  ActionTypes.GET_SCENES_SUCCESS,
  props<{ scenes: SceneWithPreview[] }>()
);

export const getScenesFailureAction = createAction(
  ActionTypes.GET_SCENES_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const saveScenesAction = createAction(
  ActionTypes.SAVE_SCENES,
  props<{ scenes: Scene[] }>()
);

export const saveScenesSuccessAction = createAction(
  ActionTypes.SAVE_SCENES_SUCCESS,
  props<{ scenes: Scene[] }>()
);

export const saveScenesFailureAction = createAction(
  ActionTypes.SAVE_SCENES_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Update scene actions
export const updateSceneAction = createAction(
  ActionTypes.UPDATE_SCENE,
  props<{ scene: Scene, files: {welcomeImage?: File, reminderImages: {[key: number]: File}} }>()
);

export const updateSceneSuccessAction = createAction(
  ActionTypes.UPDATE_SCENE_SUCCESS,
  props<{ scene: Scene }>()
);

export const updateSceneFailureAction = createAction(
  ActionTypes.UPDATE_SCENE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Create scene actions
export const createSceneAction = createAction(
  ActionTypes.CREATE_SCENE,
  props<{ scene: Scene, files: {welcomeImage?: File, reminderImages: {[key: number]: File}} }>()
);

export const createSceneSuccessAction = createAction(
  ActionTypes.CREATE_SCENE_SUCCESS,
  props<{ scene: Scene }>()
);

export const createSceneFailureAction = createAction(
  ActionTypes.CREATE_SCENE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Delete scene actions
export const deleteSceneAction = createAction(
  ActionTypes.DELETE_SCENE,
  props<{ sceneId: string }>()
);

export const deleteSceneSuccessAction = createAction(
  ActionTypes.DELETE_SCENE_SUCCESS,
  props<{ sceneId: string }>()
);

export const deleteSceneFailureAction = createAction(
  ActionTypes.DELETE_SCENE_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
