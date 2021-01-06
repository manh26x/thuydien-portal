import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PreviewUser} from '../model/user';

@Component({
  templateUrl: './dialog-preview.component.html'
})
export class DialogPreviewComponent implements OnInit {
  userList: PreviewUser[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.userList = this.config.data;
  }

  doSave() {

  }

  doCancel() {
    this.ref.close();
  }

}
