import { Component, OnInit } from '@angular/core';
import {TagsService} from '../service/tags.service';
import {BaseComponent} from '../../../core/base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {TagDetail, TagsUser} from '../model/tags';
import {TagsEnum} from '../model/tags.enum';

@Component({
  selector: 'aw-tags-view',
  templateUrl: './tags-view.component.html',
  styles: [
  ]
})
export class TagsViewComponent extends BaseComponent implements OnInit {
  tagDetail: TagDetail = {};
  tagConst = TagsEnum;

  constructor(
    private tagService: TagsService,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private messageService: MessageService,
    private translate: TranslateService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.tagService.setPage('view');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.tagService.getDetail(id).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.tagDetail = res;
    });
  }

  doCancel() {
    this.router.navigate(['tags']);
  }

}
