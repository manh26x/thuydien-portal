import {AfterViewInit, Component,  ViewChild} from '@angular/core';
import {TabView} from "primeng/tabview";
import {BehaviorSubject} from "rxjs";
import {BaseComponent} from "../../../core/base.component";
import {AppTranslateService} from "../../../core/service/translate.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'aw-user-tab',
  templateUrl: './user-tab.component.html',
  styles: [
  ]
})
export class UserTabComponent extends BaseComponent  implements AfterViewInit {
  @ViewChild('tabView',  {static: false}) tabView: TabView;

  tabEmitter$: BehaviorSubject<TabView>;
  index: number = 0;
  constructor(
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      let index = params['index'];
      this.index = parseInt(index? index: 0);
      setTimeout(() => {
        this.changeTab();
      }, 500)
    });
  }

  changeTab() {
    this.tabView.cd.markForCheck();
    this.tabView._activeIndex = this.index;
    this.tabView.activeIndexChange.emit(this.index);
    setTimeout(() => {
      this.tabView.updateInkBar();
    }, 500)
    this.tabEmitter$ = new BehaviorSubject<TabView>(this.tabView);

  }

}
