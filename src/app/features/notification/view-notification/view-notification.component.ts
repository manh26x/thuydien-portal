import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IndicatorService} from "../../../shared/indicator/indicator.service";
import {DomSanitizer} from "@angular/platform-browser";
import {finalize} from "rxjs/operators";
import {NotificationConst} from "../notification";

@Component({
  selector: 'aw-view-notification',
  templateUrl: './view-notification.component.html',
  styles: [
  ]
})
export class ViewNotificationComponent extends BaseComponent implements OnInit {

  notificationDetail: any;
  notificationConst = NotificationConst;
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.indicator.showActivityIndicator();
    this.notificationService.setPage('view');
    this.notificationService.detailNotification(this.route.snapshot.paramMap.get('id'))
      .pipe(finalize(() => this.indicator.hideActivityIndicator()))
      .subscribe(res => this.notificationDetail = res);
  }

  doCancel() {
    this.router.navigate(['/notification']);
  }
}
