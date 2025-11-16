import { createAction, props } from '@ngrx/store';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import { RefInfo } from '../../types/page.interface';

export const getRefsAction = createAction(
  ActionTypes.GET_REFS,
  props<{ accountId: string }>()
);

export const getRefsSuccessAction = createAction(
  ActionTypes.GET_REFS_SUCCESS,
  props<{ refs: RefInfo[][] }>()
);

export const getRefsFailureAction = createAction(
  ActionTypes.GET_REFS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

export const clearRefsAction = createAction(ActionTypes.CLEAR_REFS);
