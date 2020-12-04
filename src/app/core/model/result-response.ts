export interface ApiResult {
  code: string;
  message: string;
}

export interface ApiResultResponse {
  message: ApiResult;
  data: any[];
}
