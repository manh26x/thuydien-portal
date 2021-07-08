
export interface DepartmentFilterRequest {
    keyword: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: string;
}
export interface DepartmentFilterResponse {
  id: number;
  name: string;
  createdDate: Date;
  modifiedDate: Date;
  status: string;
  description: string;
}
