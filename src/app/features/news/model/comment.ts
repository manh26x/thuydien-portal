import {TreeNode} from 'primeng/api';
import {SafeUrl} from '@angular/platform-browser';

export interface CommentRequest {
  idNews: number;
  idParent: number;
  page: number;
  pageSize: number;
}

export interface CommentDto {
  id: number;
  idNews: number;
  username: string;
  idParent: number;
  avatar: null;
  fullName: string;
  type: string;
  content: string;
  status: number;
  createDate: Date;
  createdBy: string;
  isFirst: boolean;
  isUpdate: boolean;
  previewUrl: SafeUrl;
  isSelect: boolean;
  fileName: any;
  filesDoc: Array<any>;
  isChangeDoc: boolean;
  image: any;
  filePath: any;

}
export interface CommentResponse {
  commentDetail: CommentDto;
  replyList: Array<CommentDto>;
}


export interface CommentResponsePage {
  content: CommentResponse[];
  data: TreeNode[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
