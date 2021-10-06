import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../../../core/base.component";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'aw-create-notifcation',
  templateUrl: './create-notification.component.html',
  styles: [
  ]
})
export class CreateNotificationComponent extends BaseComponent implements OnInit {

  constructor(
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.setPage('create');
  }

}
