import {TreeNode} from 'primeng/api';

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
