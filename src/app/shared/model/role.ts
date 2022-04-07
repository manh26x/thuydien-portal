export interface Role {
  id?: string;
  name?: string;
  statusCode?: string;
  description?: string;
  status?: string;
  mobileActive?: number;
  portalActive?: number;
}

export interface UserRole {
  userId?: string;
  roleId?: string;
  roleName?: string;
  status?: number;
}

export enum RoleEnum {
  ADMIN = 'admin',
  SUPPER_ADMIN = 'SuperAdmin',
  ACTION_INSERT = '1',
  ACTION_VIEW = '4',
  ACTION_EDIT = '2',
  ACTION_DELETE = '3',
  ACTION_ON_OFF = '5',
  ACTION_IMPORT = '6',
  ACTION_EXPORT = '7',
  ACTION_APPROVE = '8',
  STATUS_ACTIVE= '1',
  STATUS_INACTIVE = '0'
}

export interface RoleTag {
  tagId?: number;
}

export interface RoleFeature {
  menuId: string;
  rightId: string;
}

export interface InsertRoleRequest {
  roleInfo: Role;
  menuRightList: RoleFeature[];
}

export interface RoleDetail {
  menuRightList?: RoleFeature[];
  roleInfo?: Role;
}
