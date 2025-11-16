import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const bulkStartBotsAction = createAction(
  ActionTypes.BULK_START_BOTS,
  props<{ apiKeys: Array<{ email: string; apiId: string }> }>()
);

export const bulkStartBotsSuccessAction = createAction(
  ActionTypes.BULK_START_BOTS_SUCCESS,
  props<{ processedCount: number; totalCount: number }>()
);

export const bulkStartBotsFailureAction = createAction(
  ActionTypes.BULK_START_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
