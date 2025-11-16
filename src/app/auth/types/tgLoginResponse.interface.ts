import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

export interface TgLoginResponseInterface extends CurrentUserInterface {
  isCreated: boolean;
}
