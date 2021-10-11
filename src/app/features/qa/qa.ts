export interface QaObject {
  question?: string;
  answer?: string;
  status?: number;
  id?: number;
}

export enum QaEnum {
  ACTIVE= 1,
  INACTIVE = 0
}
