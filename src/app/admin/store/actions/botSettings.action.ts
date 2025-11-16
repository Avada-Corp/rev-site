import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { Bot } from '../types/adminState.interface';
import { BotSettings } from 'src/app/shared/types/botSettings.interface';

export const getBotSettingsAction = createAction(ActionTypes.GET_BOTS_SETTINGS);

export const getBotSettingsSuccessAction = createAction(
  ActionTypes.GET_BOTS_SETTINGS_SUCCESS,
  props<{ settings: BotSettings }>()
);

export const getBotSettingsFailureAction = createAction(
  ActionTypes.GET_BOTS_SETTINGS_FAILURE,
  props<{ errors: BackendErrorsInterface; status: number }>()
);
