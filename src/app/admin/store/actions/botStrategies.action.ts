import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { BotStrategy } from '../types/adminState.interface';

export const getBotStrategiesAction = createAction(
  ActionTypes.GET_BOT_STRATEGIES
);

export const getBotStrategiesSuccessAction = createAction(
  ActionTypes.GET_BOT_STRATEGIES_SUCCESS,
  props<{ botStrategies: BotStrategy[] }>()
);

export const getBotStrategiesFailureAction = createAction(
  ActionTypes.GET_BOT_STRATEGIES_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const editBotStrategyAction = createAction(
  ActionTypes.EDIT_BOT_STRATEGY,
  props<{
    strategyId: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    minDeposit?: number;
    actualLeverage?: number;
    isSpot?: boolean;
  }>()
);

export const editBotStrategySuccessAction = createAction(
  ActionTypes.EDIT_BOT_STRATEGY_SUCCESS,
  props<{ strategy: BotStrategy }>()
);

export const editBotStrategyFailureAction = createAction(
  ActionTypes.EDIT_BOT_STRATEGY_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
