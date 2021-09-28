import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {CommentService} from '../service/comment.service';
import {ActivatedRoute} from '@angular/router';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {CommentRequest} from '../model/comment';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {CommentEnum} from '../model/news.enum';
import {Paginator} from 'primeng/paginator';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TreeTable} from 'primeng/treetable';
import { saveAs } from 'file-saver';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NewsService} from '../service/news.service';
import {environment} from '../../../../environments/environment';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {AuthService} from '../../../auth/auth.service';
@Component({
  selector: 'aw-news-comment',
  templateUrl: './news-comment.component.html',
  styles: [
  ]
})
export class NewsCommentComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('commentPaging') paging: Paginator;
  @ViewChild('pTreeTable') pTreeTable: TreeTable;
  @ViewChild('contentIn') contentIn: any;

  @Input() isView: boolean;
  isChangeImage = false;
  filesImage: any[];
  commentTree: TreeNode[] = [];
  treeEmitter$ = new BehaviorSubject<TreeNode[]>(this.commentTree);


  baseUrl = '';
  pageSize = 10;
  totalItems: number;
  page = 0;
  idNews: number;
  request: CommentRequest = null;
  commentEnum = CommentEnum;
  commentForm: FormGroup;
  contentValue = '';
  previewUrl: SafeUrl;
  isSelect = true;
  fileName: any;
  filesDoc = [];
  isChangeDoc = true;
  username: any;
  images: any[];
  displayCustom: boolean;
  activeIndex = 0;
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private indicator: IndicatorService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private newsService: NewsService,
    private dialog: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    super();
    this.baseUrl = environment.mediaUrl;
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.pTreeTable.el.nativeElement.contains(event.target)) {
      // clicked outside => clear comment form
      this.clearCmtForm();
    }
  }
  ngAfterViewInit(): void {
    this.paging.changePage(this.page);

  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id'))).subscribe( id => {
      // tslint:disable-next-line:radix
        this.idNews = Number.parseInt(id);
    });

    const user = this.authService.getUserInfo();
    this.username = user.userName;
    this.commentForm = this.fb.group({
      idParent: [null],
      content: ['', [Validators.maxLength(1000)]],
      idNews: [this.idNews],
      type: [CommentEnum.CMT],
      imgPath: null,
      filePath: null,
      isUpdate: false,
    });

  }
  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.commentForm.get(controlName);
    if (control == null) {
      return false;
    }
    return control.hasError(errorName);
  }
  changePage(evt) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.request = {
      idNews: this.idNews ,
      idParent: null,
      page: this.page,
      pageSize: this.pageSize
    };
    this.getComment();
  }


  replyClicked(row, evt) {
    this.clearImage();
    this.doClearDoc();
    this.commentTree.forEach(cmt => {
      if (cmt.data.id === row.id) {
        cmt.expanded = true;
        cmt.children[cmt.children.length - 1].data.id = -1;
        cmt.children[cmt.children.length - 1].data.status = 0;
        this.commentForm.get('idParent').setValue(row.id);
        this.commentForm.get('type').setValue(CommentEnum.REP);
      } else {
        cmt.children[cmt.children.length - 1].data.id = null;

      }
    });
    this.treeEmitter$.next(this.commentTree);

    setTimeout(() => {
      this.contentIn.nativeElement.focus();
    }, 500);
  }

  getComment() {
    this.indicator.showActivityIndicator();
    this.commentService.getAllComment(this.request).pipe(
      map(res => {
        res.data = res.content.map(cmt => {
          cmt.commentDetail.previewUrl = undefined;
          cmt.commentDetail.isSelect = true;
          cmt.commentDetail.fileName = '';
          cmt.commentDetail.filesDoc = [] ;
          cmt.commentDetail.isChangeDoc = true;
          cmt.replyList.forEach(rep => {
            rep.previewUrl = undefined;
            rep.isSelect = true;
            rep.fileName = '';
            rep.filesDoc = [] ;
            rep.isChangeDoc = true;
          });
          cmt.replyList.push({
            avatar: null,
            content: null,
            createDate: undefined,
            createdBy: '',
            fullName: '',
            id: undefined,
            idNews: this.idNews,
            status: 0,
            username: '',
            idParent: cmt.commentDetail.id,
            type: CommentEnum.REP,
            isFirst: false,
            isUpdate: false,
            previewUrl: undefined,
            isSelect: true,
            fileName: '',
            filesDoc: [],
            isChangeDoc: true,
            image: '',
            filePath: ''
          });
          cmt.replyList[0].isFirst = true;
          return {
            data: cmt.commentDetail,
            children: cmt.replyList.map(rep => {
              return {data: rep};
            }),
            expanded: true
          };
        });
        return res;
      }),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
        this.commentTree = res.data;
        this.totalItems = res.totalElements;
      },
      (error) => console.log('error', error),
      () => {
        this.treeEmitter$.next(this.commentTree);

      });
  }
  onEnter(cmt) {
    let body = this.commentForm.value;
    const listObs: Observable<string>[] = [];

    if (cmt !== '' ){
      body = cmt;
      if (cmt.filesImage?.length > 0) {
        const listFormData: FormData = new FormData();
        listFormData.append('file', cmt.filesImage[0]);
        listObs.push(this.newsService.uploadFile(listFormData));
      } else {
        listObs.push(of(null));
      }

      if (cmt.filesDoc.length > 0) {
        const listFormData: FormData = new FormData();
        listFormData.append('file', cmt.filesDoc[0]);
        listObs.push(this.newsService.uploadFile(listFormData));
      } else {
        listObs.push(of(null));
      }

    } else {
      body.idParent = null;
      if (this.filesImage?.length > 0) {
        const listFormData: FormData = new FormData();
        listFormData.append('file', this.filesImage[0]);
        listObs.push(this.newsService.uploadFile(listFormData));
      } else {
        listObs.push(of(null));
      }

      if (this.filesDoc.length > 0) {
        const listFormData: FormData = new FormData();
        listFormData.append('file', this.filesDoc[0]);
        listObs.push(this.newsService.uploadFile(listFormData));
      } else {
        listObs.push(of(null));
      }
    }
    if (body.content.trim() === '') {
      return;
    }
    if (body.content.length >= 1000) {
      return;
    }

    body.id = body.id === -1 ? undefined : body.id;

    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.imgPath = fileInfo[0] === null ? body.imgPath : fileInfo[0];
        body.filePath = fileInfo[1] === null ? body.filePath : fileInfo[1];
        return this.commentService.postComment(body);
      })).subscribe(res => {
        this.contentValue = '';
        this.commentForm.get('content').setValue('');
        this.contentValue = '';
        this.filesImage = [];
        this.clearImage();
        this.doClearDoc();
        this.paging.changePage(this.page);
    }, err => this.indicator.hideActivityIndicator());


  }

  onExport() {
    if (this.isView) {
      return;
    }
    this.indicator.showActivityIndicator();
    this.commentService.exportCommentFile(this.idNews).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      const myBlob: Blob = new Blob([res], { type: 'application/ms-excel' });
      saveAs(myBlob, 'comment_list.xlsx');
    }, error => {
      this.indicator.hideActivityIndicator();

    });
  }
  doChangeImage(files) {
    this.isChangeImage = true;
    this.filesImage = files;
    this.previewFile(files);
    this.commentForm.patchValue({
      image: files
    });
  }

  onFileChange(event, type: string) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      this.clearImage();
      if (type === 'img') {
        this.doChangeImage(files);
      } else {
        this.fileName = files[0].name;
        this.isChangeDoc = false;
        this.filesDoc = files;
      }

    }
  }

  onCmtFileChange(event , type: string, rowData: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      this.clearCmtImage(rowData);
      if (type === 'img') {
        rowData.isChangeImage = true;
        rowData.filesImage = files;
        const objUrl = window.URL.createObjectURL(files[0]);
        rowData.previewUrl = this.sanitizer.bypassSecurityTrustUrl(objUrl);
        rowData.isSelect = false;
        rowData.image = files;
      } else {
        rowData.fileName = files[0].name;
        rowData.isChangeDoc = false;
        rowData.filesDoc = files;
      }

    }
  }

  doClearDoc() {
    this.isChangeDoc = true;
    this.filesDoc = [];
    this.commentForm.patchValue({
      filePath: ''
    });
  }
  doCmtClearDoc(rowData) {
    rowData.isChangeDoc = true;
    rowData.filesDoc = [];
    rowData.filePath = ''
  }

  previewFile(files) {
    const objUrl = window.URL.createObjectURL(files[0]);
    this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(objUrl);
    this.isSelect = false;
  }

  doClearImage() {
    this.isChangeImage = true;
    this.filesImage = [];
    this.commentForm.patchValue({
      image: ''
    });
  }
  submit() {
    this.onEnter('');
  }

  clearImage() {
    this.isSelect = true;
    this.doClearImage();
  }
  clearCmtImage(rowData) {
    rowData.isChangeImage = true;
    rowData.filesImage = [];
    rowData.image = '';
    rowData['isSelect'] = true;
  }

  deleteClicked(rowData: any, $event: MouseEvent) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteCmtMessage', { name: rowData.content }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.commentService.deleteCmt(rowData.id.toString()).pipe(
        ).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteCmtSuccess')
          });
          this.getComment();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.deleteCmtNotFound')
            });
          } else {
            throw err;
          }
        });
      },
      reject: () => {}
    });
  }

  updateClicked(rowData: any, $event: MouseEvent) {
    this.clearCmtImage(rowData);
    if (rowData.filePath !== null) {
      rowData['isChangeDoc'] = false;
    }
    rowData.isUpdate = true;
  }

  clearCmtForm() {
    this.commentTree.forEach(e => {
      e.data.isUpdate = false;
      e.children[e.children.length - 1].data.status = 1;
      e.children[e.children.length - 1].data.id = undefined;
      e.children.forEach(child => {
        child.data.isUpdate = false;
      });
    });
    this.treeEmitter$.next(this.commentTree);
  }


  hasError(content) {
    return content !== null && content.length >= 1000;
  }
  imageClick(rowData) {
    this.images = [rowData];
    this.displayCustom = true;
  }
}
