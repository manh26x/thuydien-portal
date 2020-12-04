import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { RoleManagementComponent } from './role-management/role-management.component';
import {SystemComponent} from './system.component';


@NgModule({
  declarations: [RoleManagementComponent, SystemComponent],
  imports: [
    CommonModule,
    SystemRoutingModule
  ]
})
export class SystemModule { }
