import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TagsService} from '../../tags/service/tags.service';
import {forkJoin} from 'rxjs';
import {TagsUser} from '../../tags/model/tags';
import {RoleService} from '../../../shared/service/role.service';
import {Role} from '../../../shared/model/role';
import {UtilService} from '../../../core/service/util.service';
import {SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {AppTranslateService} from '../../../core/service/translate.service';
import {concatMap, startWith} from 'rxjs/operators';
import {NewsEnum} from '../model/news.enum';
import {NewsDetail} from '../model/news';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'aw-news-form',
  templateUrl: './news-form.component.html',
  styles: [`
    .content-readonly {
      border: 1px solid #c5c5c5;
      padding: 1rem;
      opacity: 1;
      max-height: 600px;
      overflow: auto;
    }
  `],
  providers: [TagsService, RoleService]
})
export class NewsFormComponent implements OnInit, OnChanges {
  yearSelect = `${new Date().getFullYear()}:${new Date().getFullYear() + 10}`;
  min = new Date();
  formNews: FormGroup;
  tagList: TagsUser[] = [];
  roleList: Role[] = [];
  levelList: SelectItem[] = [];
  filesImage: any[];
  filesDoc: any[];
  contentReadable: any = '';
  @Input() mode = 'create';
  @Input() valueForm: NewsDetail;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();
  @Output() draft: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private tagService: TagsService,
    private roleService: RoleService,
    private util: UtilService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private sanitizer: DomSanitizer
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.mode === 'view') {
      this.formNews.get('title').disable();
      this.formNews.get('shortContent').disable();
      this.formNews.get('content').disable();
      this.formNews.get('tags').disable();
      this.formNews.get('groupView').disable();
      this.formNews.get('publishDate').disable();
      this.formNews.get('level').disable();
      this.formNews.get('docs').disable();
      this.formNews.get('image').disable();
      this.formNews.get('isSendNotification').disable();
    }
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
    const obsRole = this.roleService.searchRole('');
    forkJoin([obsTag, obsRole]).subscribe(res => {
      this.tagList = res[0];
      this.roleList = res[1];
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.valueForm) {
      if (!changes.valueForm.firstChange) {
        const news: NewsDetail = changes.valueForm.currentValue;
        if (this.mode === 'update') {
          if (news.newsDto.publishTime <= new Date().getTime()) {
            this.formNews.get('publishDate').disable();
          }
        }
        this.contentReadable = this.sanitizer.bypassSecurityTrustHtml(news.newsDto.content);
        this.formNews.setValue({
          id: news.newsDto.id,
          title: news.newsDto.title,
          shortContent: news.newsDto.shortContent,
          content: news.newsDto.content,
          tags: news.tagOfNews ? news.tagOfNews.map(tags => {
            return { tagId: tags.idTag };
          }) : [],
          groupView: news.listRole ? news.listRole.map(role => {
            return { id: role.roleId };
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
    if (this.formNews.invalid) {
      this.util.validateAllFields(this.formNews);
    } else {
      this.save.emit( { news: this.formNews.getRawValue(), fileImageList: this.filesImage, fileDocList: this.filesDoc });
    }
  }

  doSaveDraft() {
    if (this.formNews.invalid) {
      this.util.validateAllFields(this.formNews);
    } else {
      this.draft.emit(this.formNews.getRawValue());
    }
  }

  doCancel() {
    this.cancel.emit();
  }

  doSelectImage(evt) {
    this.filesImage = evt.currentFiles;
  }

  doClearImage() {
    this.filesImage = [];
  }

  doSelectDoc(evt) {
    this.filesDoc = evt.currentFiles;
  }

  doClearDoc() {
    this.filesDoc = [];
  }

  initForm() {
    const now = new Date();
    now.setMinutes(0, 0);
    this.formNews = this.fb.group({
      id: [],
      title: [''],
      shortContent: [''],
      content: [''],
      tags: [],
      groupView: [],
      publishDate: [now],
      level: [NewsEnum.LEVEL_NORMAL],
      docs: [''],
      image: [''],
      isSendNotification: [false]
    });
  }

}
