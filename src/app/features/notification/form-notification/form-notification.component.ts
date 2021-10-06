import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {concatMap, startWith, takeUntil} from "rxjs/operators";
import {NotificationConst} from "../notification";
import {TranslateService} from "@ngx-translate/core";
import {AppTranslateService} from "../../../core/service/translate.service";
import {BaseComponent} from "../../../core/base.component";
import {TagsService} from "../../tags/service/tags.service";

@Component({
  selector: 'aw-form-notification',
  templateUrl: './form-notification.component.html',
  styles: [
  ]
})
export class FormNotificationComponent extends BaseComponent implements OnInit {
  tagList = [];
  statusList = [];
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
  @ViewChild('fileContent', {static: true}) fileContent: ElementRef;
  @Input() mode = 'create';
  @Input() isNotPublished = true;

  constructor(private translate: TranslateService,
              private tagService: TagsService,
              private appTranslate: AppTranslateService) {
    super();
  }

  ngOnInit(): void {
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
}
