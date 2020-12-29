import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TagsService} from '../../tags/service/tags.service';
import {forkJoin} from 'rxjs';
import {TagsUser} from '../../tags/model/tags';
import {UtilService} from '../../../core/service/util.service';
import {ConfirmationService, SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith} from 'rxjs/operators';
import {NewsEnum} from '../model/news.enum';
import {NewsDetail} from '../model/news';
import {environment} from '../../../../environments/environment';
import {ImageUploadComponent} from '../../../shared/custom-file-upload/image-upload/image-upload.component';
import {DomSanitizer} from '@angular/platform-browser';
import {BranchService} from '../../../shared/service/branch.service';
import {Branch} from '../../../shared/model/branch';

@Component({
  selector: 'aw-news-form',
  templateUrl: './news-form.component.html',
  providers: [TagsService, BranchService]
})
export class NewsFormComponent implements OnInit, OnChanges {
  yearSelect = `${new Date().getFullYear()}:${new Date().getFullYear() + 10}`;
  min = new Date();
  formNews: FormGroup;
  tagList: TagsUser[] = [];
  branchList: Branch[] = [];
  levelList: SelectItem[] = [];
  filesImage: any[];
  filesDoc: any[] = [];
  // update mode
  fileDocPreview: any = '';
  isChangeImage = false;
  isChangeDoc = false;
  @ViewChild(ImageUploadComponent, {static: true}) imgUploadComponent: ImageUploadComponent;
  @Input() mode = 'create';
  @Input() valueForm: NewsDetail;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() draft: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private tagService: TagsService,
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private sanitizer: DomSanitizer,
    private dialog: ConfirmationService,
    private branchService: BranchService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.translate.get('levelList').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.levelList = [
        { label: res.normal, value: NewsEnum.LEVEL_NORMAL },
        { label: res.important, value: NewsEnum.LEVEL_IMPORTANT },
        { label: res.veryImportant, value: NewsEnum.LEVEL_VERY_IMPORTANT }
      ];
    });
    const obsTag = this.tagService.getAllTag();
    const obsRole = this.branchService.getBranchList();
    forkJoin([obsTag, obsRole]).subscribe(res => {
      this.tagList = res[0];
      this.branchList = res[1];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const news: NewsDetail = changes.valueForm.currentValue;
        if (this.mode === 'update') {
          if (news.newsDto.status === NewsEnum.STATUS_PUBLISHED) {
            this.formNews.get('publishDate').disable();
          }
          if (news.newsDto?.image) {
            this.imgUploadComponent.previewAsUrl(`${environment.mediaUrl}${news.newsDto.image}`);
          }
          if (news.newsDto?.filePath) {
            this.fileDocPreview = this.sanitizer.bypassSecurityTrustUrl(`${environment.mediaUrl}${news.newsDto.filePath}`);
          }
        }
        this.formNews.setValue({
          id: news.newsDto.id,
          title: news.newsDto.title,
          shortContent: news.newsDto.shortContent,
          content: news.newsDto.content,
          tags: news.tagOfNews ? news.tagOfNews.map(tags => {
            return { tagId: tags.idTag };
          }) : [],
          branch: news.listBranch ? news.listBranch.map(branch => {
            return { id: branch.id };
          }) : [],
          publishDate: new Date(news.newsDto.publishTime),
          level: news.newsDto.priority,
          docs: news.newsDto.filePath,
          image: news.newsDto.image,
          isSendNotification: false
        });
      }
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
    if (value.title.length > 500 || value.shortContent.length > 400) {
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
  }

  doSelectDoc(evt) {
    this.isChangeDoc = true;
    this.filesDoc = evt.currentFiles;
  }

  doClearDoc() {
    this.isChangeDoc = true;
    this.filesDoc = [];
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
      branch: [null, [Validators.required]],
      publishDate: [now],
      level: [NewsEnum.LEVEL_NORMAL, [Validators.required]],
      docs: [''],
      image: [''],
      isSendNotification: [false]
    }, { validators: this.publishDateMatcher, updateOn: 'change' });
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

}
