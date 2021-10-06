import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotificationComponent} from './notification.component';
import {NotificationDataComponent} from './notification-data/notification-data.component';
import {CreateNotificationComponent} from './create-notifcation/create-notification.component';
import {UpdateNotificationComponent} from './update-notification/update-notification.component';
import {ViewNotificationComponent} from './view-notification/view-notification.component';

const routes: Routes = [
  {
    path: '', component: NotificationComponent,
    children: [
      {path: '', component: NotificationDataComponent},
      {path: 'create', component: CreateNotificationComponent},
      {path: 'update/:id', component: UpdateNotificationComponent},
      {path: 'view/:id', component: ViewNotificationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
