import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import { CurrentUserTokenResponseInterface } from 'src/app/shared/types/currentUserTokenResponse.interface';

export interface AuthStateInterface {
  isSubmitting: boolean;
  currentUser: CurrentUserTokenResponseInterface | null;
  isLoggedIn: boolean | null;
  validationErrors: BackendErrorsInterface | null;
  isLoading: boolean;
}
