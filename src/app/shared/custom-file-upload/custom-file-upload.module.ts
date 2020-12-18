import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';



@NgModule({
  declarations: [ImageUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule
  ],
  exports: [ImageUploadComponent]
})
export class CustomFileUploadModule { }
