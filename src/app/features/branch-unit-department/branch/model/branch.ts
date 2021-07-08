
export interface BranchFilterRequest {
  keyword: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}


export interface BranchFilterResponse {
  id: number;
  code: string;
  name: string;
  createdDate: Date;
  modifiedDate: Date;
  status: string;
  address: string;
}
