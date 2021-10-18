export enum CarBrandConst {
  ACTIVE= 1,
  INACTIVE = 0
}
export class CarBrand {
  brand?: string;
  createdBy?: string;
  createdDate?: Date;
  id?: number;
  modifiedBy?: string;
  modifiedDate?: string;
  status?: number;
}
export class CarModel {
  brandId?: number;
  brandValue?: string;
  createdBy?: string;
  model?: string;
  createdDate?: Date;
  id?: number;
  modifiedBy?: string;
  modifiedDate?: string;
  status?: number;
}
