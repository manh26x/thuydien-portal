export interface Role {
  id?: string;
  name?: string;
  statusCode?: string;
  description?: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
  status: number;
}

export enum RoleEnum {
  ADMIN = 'admin',
  SUPPER_ADMIN = 'SuperAdmin'
}
