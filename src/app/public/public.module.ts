import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ErrorComponent } from './error/error.component';
import {PublicRoutingModule} from './public-routing.module';
import {ButtonModule} from 'primeng/button';



@NgModule({
  declarations: [NotFoundComponent, AccessDeniedComponent, ErrorComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ButtonModule
  ]
})
export class PublicModule { }
