import {AfterViewInit, Component,  ViewChild} from '@angular/core';
import {TabView} from "primeng/tabview";
import {BehaviorSubject} from "rxjs";
import {BaseComponent} from "../../../../core/base.component";
import {AppTranslateService} from "../../../../core/service/translate.service";

@Component({
  selector: 'aw-user-tab',
  templateUrl: './user-tab.component.html',
  styles: [
  ]
})
export class UserTabComponent extends BaseComponent  implements AfterViewInit {
  @ViewChild('tabView') tabView: TabView;

  tabEmitter$: BehaviorSubject<TabView>;
  index: number = 1;
  constructor(
    private appTranslate: AppTranslateService,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tabEmitter$ = new BehaviorSubject<TabView>(this.tabView);
      this.tabView.cd.markForCheck();
      this.tabView._activeIndex = this.index;
      this.tabEmitter$.next(this.tabView);
    }, 500);

  }

}
