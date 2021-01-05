import {Component, Input, OnInit} from '@angular/core';
import {TagDetail, TagsUser} from '../../tags/model/tags';
import {TagsService} from '../../tags/service/tags.service';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {TagsEnum} from '../../tags/model/tags.enum';
import {forkJoin} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'aw-tag-list',
  templateUrl: './tag-list.component.html',
  styles: [
  ]
})
export class TagListComponent implements OnInit {
  @Input() tagNewsList: TagDetail[];
  @Input() tagKpiList: TagDetail[];
  @Input() tagNewsSelectedList: TagDetail[] = [];
  @Input() tagKpiSelectedList: TagDetail[] = [];
  constructor() { }

  ngOnInit(): void {

  }



}
