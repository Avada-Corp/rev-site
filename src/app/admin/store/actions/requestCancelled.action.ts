import { createAction } from '@ngrx/store';
import { ActionTypes } from '../actionTypes';

export const requestCancelledAction = createAction(
  ActionTypes.REQUEST_CANCELLED
);
