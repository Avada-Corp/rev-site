export interface AuthResponseInterface {
  accessToken: string;
  refreshToken: string;
  email: string;
  tgAccount: string;
  userRole?: import('../../shared/types/userRole.enum').UserRole;
}
