import { createAction, props } from '@ngrx/store';

import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { ActionTypes } from '../actionTypes';
import {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnersResponse,
} from '../types/adminState.interface';

// Get partners actions
export const getPartnersAction = createAction(ActionTypes.GET_PARTNERS);

export const getPartnersSuccessAction = createAction(
  ActionTypes.GET_PARTNERS_SUCCESS,
  props<{ partners: Partner[] }>()
);

export const getPartnersFailureAction = createAction(
  ActionTypes.GET_PARTNERS_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Create partner actions
export const createPartnerAction = createAction(
  ActionTypes.CREATE_PARTNER,
  props<{ partnerData: CreatePartnerRequest }>()
);

export const createPartnerSuccessAction = createAction(
  ActionTypes.CREATE_PARTNER_SUCCESS,
  props<{ partner: Partner }>()
);

export const createPartnerFailureAction = createAction(
  ActionTypes.CREATE_PARTNER_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Update partner actions
export const updatePartnerAction = createAction(
  ActionTypes.UPDATE_PARTNER,
  props<{ partnerData: UpdatePartnerRequest }>()
);

export const updatePartnerSuccessAction = createAction(
  ActionTypes.UPDATE_PARTNER_SUCCESS,
  props<{ partner: Partner }>()
);

export const updatePartnerFailureAction = createAction(
  ActionTypes.UPDATE_PARTNER_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);

// Delete partner actions
export const deletePartnerAction = createAction(
  ActionTypes.DELETE_PARTNER,
  props<{ partnerId: number }>()
);

export const deletePartnerSuccessAction = createAction(
  ActionTypes.DELETE_PARTNER_SUCCESS,
  props<{ partnerId: number }>()
);

export const deletePartnerFailureAction = createAction(
  ActionTypes.DELETE_PARTNER_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
