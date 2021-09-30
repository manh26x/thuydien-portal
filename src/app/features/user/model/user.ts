import {Role, UserRole} from '../../../shared/model/role';

export interface UserInfo {
  avatar?: string;
  createdBy?: string;
  createdDate?: Date;
  email?: string;
  fullName?: string;
  id?: string;
  modifiedBy?: string;
  modifiedDate?: Date;
  phone?: string;
  position?: string;
  role?: string;
  statusCode?: string;
  userName?: string;
  userType?: string;
  userApprove?: string;
  status?: string;
  departmentId?: number;
  departmentName?: string;
  unitId?: number;
  unitName?: string;
}

export interface BranchUser {
  branchId?: string;
  userId?: string;
  branchName?: string;
  branchAddress?: string;
}

export interface UserBranch {
  user?: UserInfo;
  listBranch?: any[];
}

export interface FilterUserRequest {
  keyword?: string;
  role?: string;
  status?: string;
  userType?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  branchId?: string;
}

export interface UserDetail {
  user?: UserInfo;
  userBranchList?: BranchUser[];
  userRoleList?: Role[];
  maxShowBranch?: number;
}

export interface FilterUserResponse {
  listUser: UserDetail[];
  totalRecord: number;
}

export interface UserData {
  user?: UserInfo;
  userBranchList?: BranchUser[];
  userRoleList?: UserRole[];
}

export interface PreviewUser {
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  unit: string;
  department: string;
  position: string;
  role: string;
}
