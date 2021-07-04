export interface Tags {
  idTag?: number;
  valueTag?: string;
  idAny?: string;
  typeAny?: string;
  assgnee?: string;
}

export interface TagsInsertRequest {
  tagValue?: string;
  tagType?: string;
  assignee?: string[];
  keyTag?: string;
}

export interface TagsSearchRequest {
  searchValue?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: string;
  sortBy?: string;
  tagType?: string[];
}

export interface TagsUser {
  tagId?: number;
  tagValue?: string;
  tagKey?: string;
  tagType?: string[];
  assignee?: {userId: string, fullName: string}[];
  maxShowTag?: number;
  maxShowAssignee?: number;
  createBy?: string;
}

export interface TagDetail {
  id?: number;
  key?: string;
  keyTag?: string;
  status?: number;
  type?: string;
  value?: string;
  createBy?: string;
  createDate?: Date;
  modifyDate?: Date;
  modifyBy?: string;
}

export interface TagsSearchResponse {
  tagsList: TagDetail[];
  totalItem: number;
}

export interface TagsUpdateRequest {
  tagId: number;
  keyTag: string;
  tagValue: string;
  tagType: string;
  tagStatus: number;
}
