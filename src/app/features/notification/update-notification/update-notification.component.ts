import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'aw-update-notification',
  templateUrl: './update-notification.component.html',
  styles: [
  ]
})
export class UpdateNotificationComponent extends BaseComponent implements OnInit {

  constructor(
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('update');
  }
}
