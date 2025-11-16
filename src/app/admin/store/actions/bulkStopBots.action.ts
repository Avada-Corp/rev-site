import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const bulkStopBotsAction = createAction(
  ActionTypes.BULK_STOP_BOTS,
  props<{ apiKeys: Array<{ email: string; apiId: string }> }>()
);

export const bulkStopBotsSuccessAction = createAction(
  ActionTypes.BULK_STOP_BOTS_SUCCESS,
  props<{ processedCount: number; totalCount: number }>()
);

export const bulkStopBotsFailureAction = createAction(
  ActionTypes.BULK_STOP_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
