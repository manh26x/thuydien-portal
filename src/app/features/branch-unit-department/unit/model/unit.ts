
export interface UnitFilterRequest {
    keyword: string;
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: string;
}
export interface UnitFilterResponse {
  id: number;
  name: string;
  createdDate: Date;
  modifiedDate: Date;
  status: string;
  description: string;
}
