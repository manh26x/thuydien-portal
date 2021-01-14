import {Component, OnInit} from '@angular/core';
import {TagDetail, TagsSearchRequest} from '../model/tags';
import {TagsService} from '../service/tags.service';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {concatMap, finalize, startWith, takeUntil} from 'rxjs/operators';
import {TagsEnum} from '../model/tags.enum';
import {UtilService} from '../../../core/service/util.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/api';
import {BaseComponent} from '../../../core/base.component';
import {AppTranslateService} from '../../../core/service/translate.service';
import {TranslateService} from '@ngx-translate/core';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {PageChangeEvent} from '../../../shared/model/page-change-event';
import {AuthService} from '../../../auth/auth.service';
import {FeatureEnum} from '../../../shared/model/feature.enum';
import {RoleEnum} from '../../../shared/model/role';

@Component({
  selector: 'aw-tags-data',
  templateUrl: './tags-data.component.html',
  styles: [
  ]
})
export class TagsDataComponent extends BaseComponent implements OnInit {
  tagsList: TagDetail[] = [];
  totalItem = 0;
  page = 0;
  pageSize = 10;
  sortBy = 'id';
  sortOrder = 'DESC';
  formSearch = new FormControl('');
  typeSearch = new FormControl('');
  tagsType = [];
  tagType = TagsEnum;
  isHasInsert = false;
  isHasEdit = false;
  isHasDel = false;
  constructor(
    private tagsService: TagsService,
    private router: Router,
    private util: UtilService,
    private indicator: IndicatorService,
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private dialog: ConfirmationService,
    private messageService: MessageService,
    private auth: AuthService
  ) {
    super();
    this.isHasInsert = this.auth.isHasRole(FeatureEnum.TAG, RoleEnum.ACTION_INSERT);
    this.isHasEdit = this.auth.isHasRole(FeatureEnum.TAG, RoleEnum.ACTION_EDIT);
    this.isHasDel = this.auth.isHasRole(FeatureEnum.TAG, RoleEnum.ACTION_DELETE);
  }

  ngOnInit(): void {
    this.tagsService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.tagsType = [
        { name: res.news, code: TagsEnum.NEWS },
        { name: res.kpi, code: TagsEnum.KPI }
      ];
    });
  }

  lazyLoadTags(evt: LazyLoadEvent) {
    this.sortBy = evt.sortField;
    this.sortOrder = evt.sortOrder === 1 ? 'ASC' : 'DESC';
    this.getListTags();
  }

  changePage(evt: PageChangeEvent) {
    this.page = evt.page;
    this.pageSize = evt.rows;
    this.getListTags();
  }

  getListTags() {
    this.indicator.showActivityIndicator();
    const request: TagsSearchRequest = {
      searchValue: this.formSearch.value,
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      tagType: this.typeSearch.value ? this.typeSearch.value.map(item => item.code) : []
    };
    this.tagsService.searchTags(request).pipe(
      takeUntil(this.nextOnDestroy),
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.tagsList = res.tagsList;
      this.totalItem = res.totalItem;
    });
  }

  doDelete(tags: TagDetail) {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteMessage', { name: tags.value }),
      acceptLabel: this.translate.instant('confirm.accept'),
      rejectLabel: this.translate.instant('confirm.reject'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.indicator.showActivityIndicator();
        this.tagsService.deleteTag(tags.id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            detail: this.translate.instant('message.deleteSuccess')
          });
          this.getListTags();
        }, err => {
          this.indicator.hideActivityIndicator();
          if (err instanceof ApiErrorResponse && err.code === '201') {
            this.messageService.add({
              severity: 'error',
              detail: this.translate.instant('message.deleteNotFound')
            });
          } else if (err instanceof ApiErrorResponse && err.code === '203') {
            this.messageService.add({
              severity: 'warn',
              detail: this.translate.instant('message.deleteUsed', { name: tags.value })
            });
          } else {
            throw err;
          }
        });
      },
      reject: () => {}
    });
  }

  refreshSearch() {
    this.formSearch.setValue('');
    this.typeSearch.setValue('');
    this.getListTags();
  }

  gotoCreate() {
    this.router.navigate(['tags', 'create']);
  }

  gotoUpdate(tagsId: number) {
    this.router.navigate(['tags', 'update', tagsId]);
  }

  gotoView(tagsId: number) {
    this.router.navigate(['tags', 'view', tagsId]);
  }

}
