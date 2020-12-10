import {TagsUser} from '../../tags/model/tags';

export interface UserInfo {
  userId?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: string;
  status?: number;
  position?: string;
}

export interface Branch {
  branchId?: string;
  userId?: string;
  branchName?: string;
  branchAddress?: string;
}

export interface UserBranch {
  userPortal?: UserInfo;
  listBranch?: any[];
}

export interface FilterUserRequest {
  keyword?: string;
  role?: string;
  status?: number;
}

export interface UserDetail {
  userPortal?: UserInfo;
  userBranchList?: Branch[];
  listTagQnA?: TagsUser[];
  listTagNews?: TagsUser[];
  listTagKPI?: TagsUser[];
  listTagTool?: TagsUser[];
}

export interface UpdateUserRequest {
  isChangePassword?: number;
  currentPassword?: string;
  userPortal?: UserInfo;
  userBranchList?: Branch[];
  listTagQnA?: TagsUser[];
  listTagNews?: TagsUser[];
  listTagKPI?: TagsUser[];
  listTagTool?: TagsUser[];
}
