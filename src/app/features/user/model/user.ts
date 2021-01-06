import {TagsUser} from '../../tags/model/tags';
import {Role} from '../../../shared/model/role';

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
  status?: string;
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
}

export interface FilterUserData {
  user: UserInfo;
  userBranchList: BranchUser[];
  userRoleList: Role[];
}

export interface FilterUserResponse {
  listUser: FilterUserData[];
  totalRecord: number;
}

export interface UserDetail {
  user?: UserInfo;
  userBranchList?: BranchUser[];
  listTagQnA?: TagsUser[];
  listTagNews?: TagsUser[];
  listTagKPI?: TagsUser[];
  listTagTool?: TagsUser[];
}

export interface UpdateUserRequest {
  isChangePassword?: number;
  currentPassword?: string;
  userPortal?: UserInfo;
  userBranchList?: BranchUser[];
  listTagQnA?: TagsUser[];
  listTagNews?: TagsUser[];
  listTagKPI?: TagsUser[];
  listTagTool?: TagsUser[];
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
