export interface CurrentUserTokenResponseInterface {
  email: string;
  userRole?: import('./userRole.enum').UserRole;
  refreshToken: string;
  tgAccount: string;
}
