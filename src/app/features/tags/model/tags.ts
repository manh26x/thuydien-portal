export interface Tags {
  idTag?: number;
  valueTag?: string;
  idAny?: string;
  typeAny?: string;
  assgnee?: string;
  searchNg?: string;
}

export interface TagsInsertRequest {
  tagValue?: string;
  tagType?: string[];
  assignee?: string[];
}

export interface TagsSearchRequest {
  searchValue?: string;
  page?: number;
  pageSize?: number;
  sortOrder?: string;
  sortBy?: string;
  tagType?: string;
}

export interface TagsUser {
  tagId?: number;
  tagValue?: string;
  tagKey?: string;
  tagType?: string[];
  assignee?: {userId: string, fullName: string}[];
}

export interface TagsSearchResponse {
  tagsList: TagsUser[];
  totalItem: number;
}

export interface TagsUpdateRequest {
  tagId: number;
  tagValue: string;
  tagType: string[];
  assignee: string[];
}
