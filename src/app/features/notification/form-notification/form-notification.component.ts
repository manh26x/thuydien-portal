import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {concatMap, startWith, takeUntil} from 'rxjs/operators';
import {NotificationConst} from '../notification';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {BaseComponent} from '../../../core/base.component';
import {TagsService} from '../../tags/service/tags.service';
import {ConfirmationService} from 'primeng/api';
import {FormBuilder, Validators} from '@angular/forms';
import {GroupViewState, MultiSelectItem, NewsDetail} from '../../news/model/news';
import {MatRadioChange} from '@angular/material/radio';
import {NewsEnum} from '../../news/model/news.enum';
import {UtilService} from '../../../core/service/util.service';
import {NotificationService} from '../service/notification.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {ImageUploadComponent} from '../../../shared/custom-file-upload/image-upload/image-upload.component';
import {Notification} from 'rxjs';

@Component({
  selector: 'aw-form-notification',
  templateUrl: './form-notification.component.html',
  styles: [
  ]
})
export class FormNotificationComponent extends BaseComponent implements OnInit, OnChanges {
  tagList = [];
  statusList = [];
  private fileImport: any;
  display = false;
  @Input() groupViewList: MultiSelectItem[] = [];
  @ViewChild('fileContent', {static: true}) fileContent: ElementRef;
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() draft: EventEmitter<any> = new EventEmitter<any>();
  @Input() mode = 'create';
  @Input() isNotPublished = true;
  @Input() groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  yearSelect: any;
  readonly min = new Date();
  private isChangeImage = false;
  private filesImage = [];
  formNoti: any;
  selectionGroup = null;
  readonly tinyMceInit = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 500,
    menubar: true,
    plugins: [
      'autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code wordcount'
    ],
    toolbar: 'formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | fullscreen',
    file_picker_types: 'image',
    automatic_uploads: false,
    file_picker_callback: (cb, value, meta) => {
      this.callbackEvent = cb;
      this.fileContent.nativeElement.click();
    },
    relative_urls: false,
    remove_script_host: false,
    convert_urls: true
  };
  private callbackEvent: any;
  private userList = '';
  @ViewChild(ImageUploadComponent, {static: true}) imgUploadComponent: ImageUploadComponent;
  constructor(private translate: TranslateService,
              private tagService: TagsService,
              private fb: FormBuilder,
              private dialog: ConfirmationService,
              private util: UtilService,
              private router: Router,
              private notificationService: NotificationService,
              private appTranslate: AppTranslateService) {
    super();
  }

  groupObject: any = null;
  notificationConst = NotificationConst;
  invalidUserList = '';
  @Input() valueForm;
  ngOnInit(): void {
    this.formNoti = this.fb.group({
      groupViewType: [NotificationConst.GROUP_VIEW_BRANCH, [Validators.required]],
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      status: [{code: NotificationConst.WAIT_SEND}, [Validators.required]],
      tags: ['', [Validators.required]],
      groupViewValue: [null],
      listAnyId: [''],
      publishDate: ['', [Validators.required]]
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



  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const noti = changes.valueForm.currentValue;
        if (this.mode === 'update') {
          if (noti.notificationDetailDto?.coverImage) {
            this.imgUploadComponent.previewAsUrl(`${environment.mediaUrl}${noti.notificationDetailDto?.coverImage}`);
          }
        }

        this.formNoti.patchValue({
          id: noti.notificationDetailDto?.id,
          title: noti.notificationDetailDto?.title,
          content: noti.notificationDetailDto?.content,
          publishDate: new Date(noti.notificationDetailDto?.publishDate),
          coverImage: noti.notificationDetailDto?.coverImage,
          groupViewType: noti.notificationDetailDto?.userViewType,
          groupViewValue: noti.notificationDetailDto?.groupViewValue,
          listAnyId: ''
        });
        if (noti.notificationDetailDto?.userViewType === NotificationConst.GROUP_VIEW_PERSON) {
          this.doCheckListAnyId({listValidUser: noti.listAnyId});
        }
      }
    }
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formNoti.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  fileContentChange($event: Event) {

  }

  doCancel() {
    this.router.navigate(['notification']);
  }

  doSaveDraft() {
    const value = this.formNoti.getRawValue();
    this.formNoti.patchValue({
      title: value.title.trim(),
      content: value.content.trim()
    });
    this.save.emit( { notification: value, fileImageList: this.filesImage, draft: 1});
  }

  doSave() {
    const value = this.formNoti.getRawValue();
    this.formNoti.patchValue({
      title: value.title.trim(),
      content: value.content.trim()
    });
    if (this.formNoti.invalid) {
      this.util.validateAllFields(this.formNoti);
    } else {
      this.save.emit( { notification: value, fileImageList: this.filesImage, draft: 0});
    }
  }

  doUpdate() {

  }


  doChangeGroupView(event: MatRadioChange) {
    this.formNoti.patchValue({
      groupViewValue: []
    });
    switch (event.value) {
      case NewsEnum.GROUP_VIEW_BRANCH:
        this.groupViewList = this.groupViewState.branchList;
        break;
      case NewsEnum.GROUP_VIEW_ROLE:
        this.groupViewList = this.groupViewState.roleList;
        break;
      case NewsEnum.GROUP_VIEW_UNIT:
        this.groupViewList = this.groupViewState.unitList;
        break;

      case NewsEnum.GROUP_VIEW_PERSON:
        this.groupViewList = undefined;

        break;
      default:
        break;
    }
  }
  doChangeFile(files) {
    this.fileImport = files;

  }


  doCheckFile() {
    if (this.fileImport && this.fileImport.length > 0) {
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.fileImport[0], this.fileImport[0].name);
      this.notificationService.checkDataImport(fileFormData).subscribe(res => {
        this.dialog.confirm({
          key: 'globalDialog',
          header: this.translate.instant('confirm.userNotiHeader'),
          message: this.translate.instant('confirm.userNoti', {validUser: res.listValidUser, invalidUser: res.listInvalidUser}),
          rejectLabel: this.translate.instant('confirm.reject'),
          acceptLabel: this.translate.instant('confirm.accept'),
          accept: () => {
            this.doCheckListAnyId(res);
          },
          reject: () => {}
        });
      }, error => console.log(error));
    }
  }
  doCheckListAnyId(res: any) {
    this.userList = this.formNoti.get('listAnyId').value;
    this.userList += this.userList.length > 0 ? ';' : '';
    res.listValidUser.forEach(user => this.userList += user + ';');
    this.userList = this.userList.slice(0, this.userList.length - 1);
    this.formNoti.patchValue({listAnyId: this.userList});
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
