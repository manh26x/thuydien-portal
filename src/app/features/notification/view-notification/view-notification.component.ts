import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'aw-view-notification',
  templateUrl: './view-notification.component.html',
  styles: [
  ]
})
export class ViewNotificationComponent extends BaseComponent implements OnInit {

  constructor(
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('view');
  }
}
