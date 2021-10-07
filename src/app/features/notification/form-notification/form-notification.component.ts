import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {concatMap, startWith, takeUntil} from "rxjs/operators";
import {NotificationConst} from "../notification";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {BaseComponent} from "../../../core/base.component";
import {TagsService} from "../../tags/service/tags.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiErrorResponse} from "../../../core/model/error-response";

@Component({
  selector: 'aw-form-notification',
  templateUrl: './form-notification.component.html',
  styles: [
  ]
})
export class FormNotificationComponent extends BaseComponent implements OnInit {
  tagList = [];
  statusList = [];
  private fileImport: any;
  display = false;
  @ViewChild('fileContent', {static: true}) fileContent: ElementRef;
  @Input() mode = 'create';
  @Input() isNotPublished = true;
  yearSelect: any;
  readonly min = new Date();
  private isChangeImage = false;
  private filesImage = [];
  formNoti: any;
  selectionGroup = null;
  constructor(private translate: TranslateService,
              private tagService: TagsService,
              private fb: FormBuilder,
              private dialog: ConfirmationService,
              private appTranslate: AppTranslateService) {
    super();
  }
  groupObject: any = null;
  ngOnInit(): void {
    this.formNoti = this.fb.group({
      groupObject: [null, [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      status: ['', [Validators.required]],
      tags: ['', [Validators.required]],
    });
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('const'))
    ).subscribe(res => {
      this.statusList = [
        { label: res.sent, code: NotificationConst.SENT },
        { label: res.nosend, code: NotificationConst.WAIT_SEND },
        { label: res.inactive, code:  NotificationConst.INACTIVE },
        { label: res.draft, code:  NotificationConst.DRAFT },
      ];

    });
    this.tagService.getAllTagNews().subscribe(tagsList => {
      this.tagList = tagsList;
    });
  }

  hasErrorInput(title: string, required: string) {

  }

  fileContentChange($event: Event) {

  }

  doCancel() {

  }

  doSaveDraft() {

  }

  doSave() {

  }

  doUpdate() {

  }

  doChangeFile(files) {
    this.fileImport = files;

  }

  doCheckFile() {
    this.display = true;
  }

  toDayClick(evt: Date) {
    evt.setMinutes(0, 0);
    return evt;
  }

  doChangeImage(files) {
    this.isChangeImage = true;
    this.filesImage = files;
  }

  doClearImage() {
    this.isChangeImage = true;
    this.filesImage = [];
    this.formNoti.patchValue({
      image: ''
    });
  }
  doClearImagePreview() {
    this.dialog.confirm({
      key: 'globalDialog',
      header: this.translate.instant('confirm.delete'),
      message: this.translate.instant('confirm.deleteImage'),
      rejectLabel: this.translate.instant('confirm.reject'),
      acceptLabel: this.translate.instant('confirm.accept'),
      accept: () => {
        this.isChangeImage = true;
        this.formNoti.get('image').setValue('');
      },
      reject: () => {}
    });
  }

}
