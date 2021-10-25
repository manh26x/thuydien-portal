import {Tags} from '../../tags/model/tags';
import {Role, UserRole} from '../../../shared/model/role';
import {Branch} from '../../../shared/model/branch';
import {Unit} from '../../../shared/model/unit';

export interface FilterNewsRequest {
  keyword: string;
  status: number;
  priorityRole: string;
  tagValue: number[];
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export interface NewsInfoRequest {
  id?: number;
  title?: string;
  shortContent?: string;
  priority?: string;
  publishTime?: Date;
  content?: string;
  imgPath?: string;
  filePath?: string;
  sendNotification?: number; // 0 or 1
  listNewsTag?: Tags[];
  listAnyId?: string[];
  isDraft?: number;
  userViewType?: string;
  isPublished?: number;
}

export interface News {
  id?: number;
  content?: string;
  image?: string;
  priority?: string;
  publishTime?: number;
  publisher?: string;
  status?: number;
  title?: string;
  tagList?: {id: number, status: number, value: string}[];
  idGroupProduct?: number;
  idGroupCustomer?: number;
  userNewsViewDto?: any;
  createDate?: Date;
  createBy?: string;
  modifyBy?: string;
  filePath?: string;
  modifyDate?: Date;
  shortContent?: string;
  maxShowTag?: number;
  userViewType?: string;
  groupViewValue?: MultiSelectItem[];
  fileName?: string;
}

export interface NewsPaging {
  listNews: News[];
  totalRecord: number;
}

export interface FileUpload {
  name: string;
  objectUrl: any;
  size: number;
  type: string;
}

export interface NewsDetail {
  newsDto?: News;
  tagOfNews?: Tags[];
  listBranch?: Branch[];
  listRole?: Role[];
  listUnit?: Unit[];
  listUser?: string[];
}

export interface MultiSelectItem {
  id: string;
  code: string;
  name: string;
  display: string;
}

export interface GroupViewState {
  branchList: MultiSelectItem[];
  unitList: MultiSelectItem[];
  roleList: MultiSelectItem[];
}
