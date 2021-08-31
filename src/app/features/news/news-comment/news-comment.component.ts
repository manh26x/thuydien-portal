import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../core/base.component';
import {CommentService} from '../service/comment.service';
import {ActivatedRoute} from '@angular/router';
import { finalize, map, takeUntil} from 'rxjs/operators';
import {CommentRequest} from '../model/comment';
import {TranslateService} from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import {CommentEnum} from '../model/news.enum';
import {Paginator} from 'primeng/paginator';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TreeTable} from 'primeng/treetable';
import { saveAs } from 'file-saver';
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

  commentTree: TreeNode[] = [];
  testEmitter$ = new BehaviorSubject<TreeNode[]>(this.commentTree);

  pageSize = 10;
  totalItems: number;
  page = 0;
  idNews: number;
  request: CommentRequest = null;
  commentEnum = CommentEnum;
  commentForm: FormGroup;
  contentValue: any;
  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private indicator: IndicatorService,
    private fb: FormBuilder,
  ) {
    super();
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
      type: [CommentEnum.CMT]
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
    this.commentTree.forEach(cmt => {
      if (cmt.data.id === row.id) {
        cmt.expanded = true;
        cmt.children[cmt.children.length - 1].data.id = 1;
        this.commentForm.value.idParent = row.id;
        this.commentForm.value.type = CommentEnum.CMT;
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
    if (this.contentValue !== ''){
      this.commentForm.value.content = this.contentValue;
    } else {
      this.commentForm.value.idParent = null;
    }
    if (this.commentForm.valid) {
      this.commentService.postComment(this.commentForm.value).subscribe(res => {
        console.log(res);
        this.contentValue = '';
        this.commentForm.value.content = '';
        this.contentValue = '';
        this.paging.changePage(this.page);
      });
    }
  }

  onExport() {
    this.indicator.showActivityIndicator();
    this.commentService.exportCommentFile(this.idNews).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      const myBlob: Blob = new Blob([res], { type: 'application/ms-excel' });
      saveAs(myBlob, 'comment_list.xlsx');
    });
  }

  submit() {
    this.contentValue = '';
    this.onEnter();
  }

}
