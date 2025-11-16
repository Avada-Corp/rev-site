import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const bulkActualizeBotsNotStartAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS_NOT_START,
  props<{
    apiKeys: Array<{
      apiId: string;
      email: string;
      username: string;
      apiName: string;
    }>;
  }>()
);

export const bulkActualizeBotsNotStartSuccessAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS_NOT_START_SUCCESS,
  props<{ processedCount: number; totalCount: number }>()
);

export const bulkActualizeBotsNotStartFailureAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS_NOT_START_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
