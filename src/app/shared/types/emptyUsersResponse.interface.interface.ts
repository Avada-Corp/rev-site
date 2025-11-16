export interface EmptyTableUser {
  name: string;
  regDate: string;
  parentRef: string;
  hasReferrals: boolean;
}
export interface EmptyUser {
  email: string;
  name: string;
  regDate: Date;
  parentRef: string;
  hasReferrals: boolean;
  userRole?: import('src/app/shared/types/userRole.enum').UserRole;
}

export type EmptyUsersResponse = EmptyUser[];
