import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const bulkActualizeBotsAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS,
  props<{
    apiKeys: Array<{
      apiId: string;
      email: string;
      username: string;
      apiName: string;
    }>;
  }>()
);

export const bulkActualizeBotsSuccessAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS_SUCCESS,
  props<{ processedCount: number; totalCount: number }>()
);

export const bulkActualizeBotsFailureAction = createAction(
  ActionTypes.BULK_ACTUALIZE_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
