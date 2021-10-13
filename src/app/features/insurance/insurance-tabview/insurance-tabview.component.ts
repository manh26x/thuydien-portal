import {Component, OnInit, ViewChild} from '@angular/core';
import {InsuranceService} from "../service/insurance.service";
import {BaseComponent} from "../../../core/base.component";
import {InsuranceDataComponent} from "../insurance-data/insurance-data.component";
import {TabView} from "primeng/tabview";
import {BehaviorSubject} from "rxjs";
import {delay, startWith, takeUntil} from "rxjs/operators";
import {AppTranslateService} from "../../../core/service/translate.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'aw-insurance-tabview',
  templateUrl: './insurance-tabview.component.html',
  styles: [
  ]
})
export class InsuranceTabviewComponent extends BaseComponent implements OnInit {
  @ViewChild(InsuranceDataComponent) insuranceData: InsuranceDataComponent;
  @ViewChild('tabView') tabView: TabView;
  tabEmitter$: BehaviorSubject<TabView>;
  constructor(
    private appTranslate: AppTranslateService,
    private translate: TranslateService,
    private insuranceService: InsuranceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.insuranceService.setPage('');
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      delay(500),
      takeUntil(this.nextOnDestroy)
    ).subscribe(_ => {
      this.tabView.cd.markForCheck();
    });
    setTimeout(() => {
      this.tabView.updateInkBar();
    }, 500);
    this.tabEmitter$ = new BehaviorSubject<TabView>(this.tabView);
  }

}
