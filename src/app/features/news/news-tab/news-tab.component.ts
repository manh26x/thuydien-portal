import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TabView} from "primeng/tabview";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BaseComponent} from "../../../core/base.component";

@Component({
  selector: 'aw-news-tab',
  templateUrl: './news-tab.component.html',
  styles: [
  ]
})
export class NewsTabComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('tabView',  {static: false}) tabView: TabView;

  tabEmitter$: BehaviorSubject<TabView>;
  index = 1;


  constructor(
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const index = params['index'];
      // tslint:disable-next-line:radix
      this.index = parseInt(index ? index : 0);
      setTimeout(() => {
        this.changeTab();
      }, 500);
    });
  }

  changeTab() {
    this.tabView.cd.markForCheck();
    this.tabView._activeIndex = this.index;
    this.tabView.activeIndexChange.emit(this.index);
    setTimeout(() => {
      this.tabView.updateInkBar();
    }, 500);
    this.tabEmitter$ = new BehaviorSubject<TabView>(this.tabView);

  }

}
