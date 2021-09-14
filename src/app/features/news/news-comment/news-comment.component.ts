import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {FormBuilder, FormGroup} from '@angular/forms';
import {TreeTable} from 'primeng/treetable';
import { saveAs } from 'file-saver';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NewsService} from '../service/news.service';
import {environment} from '../../../../environments/environment';
import {ApiErrorResponse} from '../../../core/model/error-response';
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
  testEmitter$ = new BehaviorSubject<TreeNode[]>(this.commentTree);


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
  ) {
    super();
    this.baseUrl = environment.mediaUrl;
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
    this.commentForm = this.fb.group({
      idParent: [null],
      content: [''],
      idNews: [this.idNews],
      type: [CommentEnum.CMT],
      imgPath: null,
      filePath: null
    });

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
        cmt.children[cmt.children.length - 1].data.id = 1;
        this.commentForm.get('idParent').setValue(row.id);
        this.commentForm.get('type').setValue(CommentEnum.REP);
      } else {
        cmt.children[cmt.children.length - 1].data.id = null;

      }
    });
    this.testEmitter$.next(this.commentTree);

    setTimeout(() => {
      this.contentIn.nativeElement.focus();
    }, 500);
  }

  getComment() {
    this.indicator.showActivityIndicator();
    this.commentService.getAllComment(this.request).pipe(
      map(res => {
        res.data = res.content.map(cmt => {
          cmt.replyList = [...cmt.replyList].reverse();
          cmt.replyList.push({
            avatar: null,
            content: null,
            createDate: undefined,
            createdBy: '',
            fullName: '',
            id: null,
            idNews: this.idNews,
            status: 0,
            username: '',
            idParent: cmt.commentDetail.id,
            type: CommentEnum.REP,
            isFirst: false
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
        this.testEmitter$.next(this.commentTree);

      });
  }

  onEnter() {
    const body = this.commentForm.value;
    if (this.contentValue !== '' ){
      body.content = this.contentValue.trim();
    } else {
      body.idParent = null;
    }
    if (body.content.trim() === '') {
      return;
    }
    const listObs: Observable<string>[] = [];
    if (this.filesImage.length > 0) {
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
    this.indicator.showActivityIndicator();
    forkJoin(listObs).pipe(
      concatMap(fileInfo => {
        body.imgPath = fileInfo[0];
        body.filePath = fileInfo[1];
        return this.commentService.postComment(body);
      })).subscribe(res => {
        this.contentValue = '';
        this.commentForm.get('content').setValue('');
        this.contentValue = '';
        this.filesImage = [];
        this.clearImage();
        this.doClearDoc();
        this.paging.changePage(this.page);
    });


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
  doClearDoc() {
    this.isChangeDoc = true;
    this.filesDoc = [];
    this.commentForm.patchValue({
      filePath: ''
    });
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
    this.contentValue = '';
    this.onEnter();
  }

  clearImage() {
    this.isSelect = true;
    this.doClearImage();
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
}
