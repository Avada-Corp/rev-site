import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';

export const bulkUpdateBotsAction = createAction(
  ActionTypes.BULK_UPDATE_BOTS,
  props<{ apiKeys: Array<{ email: string; apiId: string }> }>()
);

export const bulkUpdateBotsSuccessAction = createAction(
  ActionTypes.BULK_UPDATE_BOTS_SUCCESS,
  props<{ processedCount: number; totalCount: number }>()
);

export const bulkUpdateBotsFailureAction = createAction(
  ActionTypes.BULK_UPDATE_BOTS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
