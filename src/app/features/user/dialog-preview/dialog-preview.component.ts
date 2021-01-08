import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PreviewUser} from '../model/user';
import {UserService} from '../service/user.service';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: './dialog-preview.component.html'
})
export class DialogPreviewComponent implements OnInit {
  userList: PreviewUser[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userList = this.config.data || [];
  }

  doSave() {
    this.userService.batchInsert(this.userList).subscribe(res => {
      this.userService.logDebug(res);
      this.ref.close(true);
    });
  }

  doCancel() {
    this.ref.close(false);
  }

}
