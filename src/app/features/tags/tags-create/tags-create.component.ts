import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TagsService} from '../service/tags.service';
import {TagsInsertRequest} from '../model/tags';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {ApiErrorResponse} from '../../../core/model/error-response';
import {finalize} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {BeforeLeave} from '../../../core/model/before-leave';

@Component({
  selector: 'aw-tags-create',
  templateUrl: './tags-create.component.html',
  styles: [
  ]
})
export class TagsCreateComponent implements OnInit, BeforeLeave {
  isLeave = false;
  constructor(
    private router: Router,
    private tagService: TagsService,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.tagService.setPage('create');
  }

  doSave(value: any) {
    this.indicator.showActivityIndicator();
    this.tagService.logDebug(value);
    const body: TagsInsertRequest = {
      keyTag: value.code.toUpperCase(),
      tagValue: value.name,
      tagType: value.type.code
    };
    this.tagService.createTags(body).pipe(
      finalize(() => this.indicator.hideActivityIndicator())
    ).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        detail: this.translate.instant('message.insertSuccess')
      });
      this.isLeave = true;
      this.router.navigate(['tags']);
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '202') {
        this.messageService.add({
          severity: 'error',
          detail: this.translate.instant('message.insertExisted')
        });
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    this.router.navigate(['tags']);
  }

  @HostListener('window:beforeunload')
  canLeave(): boolean {
    return this.isLeave;
  }

}
