import {Component, Input, OnInit} from '@angular/core';
import {TagDetail} from '../../tags/model/tags';

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
