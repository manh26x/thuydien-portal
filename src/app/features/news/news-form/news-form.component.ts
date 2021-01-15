import {
  ChangeDetectionStrategy,
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
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TagsService} from '../../tags/service/tags.service';
import {TagDetail} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith, takeUntil} from 'rxjs/operators';
import {NewsEnum} from '../model/news.enum';
import {GroupViewState, MultiSelectItem, NewsDetail} from '../model/news';
import {environment} from '../../../../environments/environment';
import {ImageUploadComponent} from '../../../shared/custom-file-upload/image-upload/image-upload.component';
import {DomSanitizer} from '@angular/platform-browser';
import {BranchService} from '../../../shared/service/branch.service';
import {BaseComponent} from '../../../core/base.component';
import {NewsService} from '../service/news.service';
import {MatRadioChange} from '@angular/material/radio';


@Component({
  selector: 'aw-news-form',
  templateUrl: './news-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsFormComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild('fileContent', {static: true}) fileContent: ElementRef;
  callbackEvent: any;
  readonly yearSelect = `${new Date().getFullYear()}:${new Date().getFullYear() + 10}`;
  readonly min = new Date();
  formNews: FormGroup;
  @Input() groupViewList: MultiSelectItem[] = [];
  levelList: SelectItem[] = [];
  filesImage: any[];
  filesDoc: any[] = [];
  // update mode
  fileDocPreview: any = '';
  fileDocDisplay = '';
  isChangeImage = false;
  isChangeDoc = false;
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
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | fullscreen',
    file_picker_types: 'image',
    automatic_uploads: false,
    file_picker_callback: (cb, value, meta) => {
      this.callbackEvent = cb;
      this.fileContent.nativeElement.click();
    }
  };
  newsConst = NewsEnum;
  isDisableDraft = false;
  @ViewChild(ImageUploadComponent, {static: true}) imgUploadComponent: ImageUploadComponent;
  @Input() mode = 'create';
  @Input() valueForm: NewsDetail;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() draft: EventEmitter<any> = new EventEmitter<any>();
  @Input() groupViewState: GroupViewState = {branchList: [], roleList: [], unitList: []};
  @Input() tagList: TagDetail[] = [];
  constructor(
    private fb: FormBuilder,
    private tagService: TagsService,
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private sanitizer: DomSanitizer,
    private dialog: ConfirmationService,
    private branchService: BranchService,
    private newsService: NewsService
  ) {
    super();
    this.initForm();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      takeUntil(this.nextOnDestroy),
      startWith(''),
      concatMap(() => this.translate.get('levelList'))
    ).subscribe(res => {
      this.levelList = [
        { label: res.normal, value: NewsEnum.LEVEL_NORMAL },
        { label: res.important, value: NewsEnum.LEVEL_IMPORTANT },
        { label: res.veryImportant, value: NewsEnum.LEVEL_VERY_IMPORTANT }
      ];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const news: NewsDetail = changes.valueForm.currentValue;
        if (this.mode === 'update') {
          if (news.newsDto.status === NewsEnum.STATUS_PUBLISHED) {
            this.isDisableDraft = true;
            this.formNews.get('publishDate').disable();
          }
          if (news.newsDto?.image) {
            this.imgUploadComponent.previewAsUrl(`${environment.mediaUrl}${news.newsDto.image}`);
          }
          if (news.newsDto?.filePath) {
            this.fileDocDisplay = news.newsDto.fileName;
            this.fileDocPreview = this.sanitizer.bypassSecurityTrustUrl(`${environment.mediaUrl}${news.newsDto.filePath}`);
          }
        }

        this.formNews.setValue({
          id: news.newsDto.id,
          title: news.newsDto.title,
          shortContent: news.newsDto.shortContent,
          content: news.newsDto.content,
          tags: news.tagOfNews ? news.tagOfNews.map(tags => {
            return { id: tags.idTag };
          }) : [],
          publishDate: new Date(news.newsDto.publishTime),
          level: news.newsDto.priority,
          docs: news.newsDto.filePath,
          image: news.newsDto.image,
          isSendNotification: false,
          groupViewType: news.newsDto.userViewType,
          groupViewValue: news.newsDto.groupViewValue
        });
      }
    }
  }

  doChangeGroupView(event: MatRadioChange) {
    this.formNews.patchValue({
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
      default:
        break;
    }
  }

  doSave() {
    const value = this.formNews.getRawValue();
    this.formNews.patchValue({
      title: value.title.trim()
    });
    if (this.formNews.invalid) {
      this.util.validateAllFields(this.formNews);
    } else {
      this.save.emit( { news: value, fileImageList: this.filesImage, fileDocList: this.filesDoc });
    }
  }

  doUpdate() {
    const value = this.formNews.getRawValue();
    this.formNews.patchValue({
      title: value.title.trim()
    });
    if (this.formNews.invalid) {
      this.util.validateAllFields(this.formNews);
    } else {
      this.save.emit( {
        news: value,
        fileImageList: this.filesImage,
        fileDocList: this.filesDoc,
        isChangeImage: this.isChangeImage,
        isChangeDoc: this.isChangeDoc
      });
    }
  }

  doSaveDraft() {
    const value = this.formNews.getRawValue();
    if ((value.title && value.title.length > 500) || (value.shortContent && value.shortContent.length > 400)) {
      return;
    }
    this.draft.emit({ news: value, fileImageList: this.filesImage, fileDocList: this.filesDoc });
  }

  doCancel() {
    this.cancel.emit();
  }

  doChangeImage(files) {
    this.isChangeImage = true;
    this.filesImage = files;
  }

  doClearImage() {
    this.isChangeImage = true;
    this.filesImage = [];
    this.formNews.patchValue({
      image: ''
    });
  }

  doSelectDoc(evt) {
    this.isChangeDoc = true;
    this.filesDoc = evt.currentFiles;
  }

  doClearDoc() {
    this.isChangeDoc = true;
    this.filesDoc = [];
    this.formNews.patchValue({
      docs: ''
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
        this.isChangeDoc = true;
        this.formNews.get('docs').setValue('');
      },
      reject: () => {}
    });
  }

  initForm() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0, 0);
    this.formNews = this.fb.group({
      id: [],
      title: ['', [Validators.required, Validators.maxLength(500)] ],
      shortContent: ['', [Validators.maxLength(400)]],
      content: ['', [Validators.required]],
      tags: [null, [Validators.required]],
      publishDate: [now],
      level: [NewsEnum.LEVEL_NORMAL, [Validators.required]],
      docs: [''],
      image: [''],
      isSendNotification: [false],
      groupViewType: [NewsEnum.GROUP_VIEW_BRANCH],
      groupViewValue: ['', Validators.required]
    }, { validators: this.publishDateMatcher });
  }

  toDayClick(evt: Date) {
    evt.setMinutes(0, 0);
    return evt;
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formNews.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  publishDateMatcher(abstract: AbstractControl): { [key: string]: boolean } | null {
    const publishDateControl = abstract.get('publishDate');
    if (publishDateControl.value === null || publishDateControl.disabled) {
      return null;
    }
    const now = new Date();
    const publishDate = publishDateControl.value;
    if (now > publishDate) {
      publishDateControl.setErrors({mustAfterNow: true});
      return { match: true };
    }
    publishDateControl.setErrors(null);
    return null;
  }

  fileContentChange(event) {
    const files = event.target.files;
    const fileFormData: FormData = new FormData();
    fileFormData.append('file', files[0], files[0].name);
    this.newsService.uploadFile(fileFormData).subscribe(res => {
      this.fileContent.nativeElement.value = '';
      this.callbackEvent(`${environment.mediaUrl}${res}`);
    });
  }

}
