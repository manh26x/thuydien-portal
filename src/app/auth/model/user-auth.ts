export interface UserAuth {
  userName: string;
  role: string;
  isSupperAdmin: boolean;
}

export interface UserRole {
  menuDescription?: string;
  menuIcon?: string;
  menuId?: string;
  menuName?: string;
  menuUrl?: string;
  rightDescription?: string;
  rightId?: string;
  rightRequestMethod?: string;
  rightUrl?: string;
  roleId?: string;
}

export interface UserAuthInfo {
  avatar?: string;
  fullName?: string;
  id?: string;
  mail?: string;
  phone?: string;
  position?: string;
  role?: string;
  status?: string;
  userName?: string;
  userType?: string;
}

export interface UserAuthDetail {
  listRole: UserRole[];
  user: UserAuthInfo;
}

export interface FeatureGroupByRole {
  [featureId: string]: UserRole[];
}
