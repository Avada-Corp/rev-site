import { createAction, props } from '@ngrx/store';
import { ActionTypes } from 'src/app/auth/store/actionTypes';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';

export const addReferralAction = createAction(
  ActionTypes.ADD_REFERRAL,
  props<{ email: string; refId: string | null }>()
);

export const addReferralSuccessAction = createAction(
  ActionTypes.ADD_REFERRAL_SUCCESS,
  props<{ isAdded: boolean }>()
);

export const addReferralFailureAction = createAction(
  ActionTypes.ADD_REFERRAL_FAILURE,
  props<{ errors: BackendErrorsInterface }>()
);
