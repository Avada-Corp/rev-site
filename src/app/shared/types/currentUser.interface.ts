export interface CurrentUserInterface {
  email: string;
  accessToken: string;
  refreshToken: string;
  tgAccount: string;
  userRole?: import('./userRole.enum').UserRole;
}
