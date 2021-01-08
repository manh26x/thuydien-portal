import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import { InputUploadComponent } from './input-upload/input-upload.component';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [ImageUploadComponent, InputUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ImageUploadComponent, InputUploadComponent]
})
export class CustomFileUploadModule { }
