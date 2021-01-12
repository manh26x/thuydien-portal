import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FeaturesComponent} from './features.component';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {ILanguage} from '../core/model/language';
import {AppTranslateService} from '../core/service/translate.service';
import {Language} from '../core/model/language.enum';
import {concatMap, startWith} from 'rxjs/operators';
import {UserAuthInfo} from '../auth/model/user-auth';

@Component({
  selector: 'aw-topbar',
  template: `
    <div class="layout-topbar">
      <a href="#" id="layout-menu-btn" class="menu-btn" (click)="onMenuButtonClick($event)">
        <i class="pi pi-bars"></i>
      </a>

      <div class="layout-topbar-menu-wrapper">
        <button type="button" pButton icon="pi pi-angle-down" label="{{currentLang.lang}}" class="p-button-text" iconPos="right" (click)="menuLang.toggle($event)">
          <img src="{{currentLang.flag}}" alt="LG" width="30" height="20" class="img-flag">&nbsp;
        </button>&nbsp;
        <button type="button" pButton icon="pi pi-angle-down" label="{{userInfo?.userName}}" class="p-button-outlined" iconPos="right" (click)="menu.toggle($event)"></button>
      </div>
    </div>
    <p-menu #menu [popup]="true" [model]="userItems"></p-menu>
    <p-menu #menuLang [popup]="true" [model]="langItems"></p-menu>
  `
})
export class TopBarComponent implements OnInit {
  userItems: MenuItem[];
  langItems: MenuItem[];
  currentLang: ILanguage;
  @Input() userInfo: UserAuthInfo;
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() topBarLogout: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public features: FeaturesComponent,
    private authService: AuthService,
    private router: Router,
    private appTranslate: AppTranslateService
  ) {
    this.currentLang = appTranslate.langs.find(lang => lang.key === localStorage.getItem(Language.LOCAL_KEY));
  }

  ngOnInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.appTranslate.getTranslationAsync('logout').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.userItems = [
        {
          label: res,
          command: () => this.topBarLogout.emit()
        }
      ];
    });
    // language
    this.langItems = [
      {
        label: `<img src="${this.appTranslate.langs[0].flag}" alt="LG" width="30" height="20" class="img-flag"> <span class="p-ml-1">${this.appTranslate.langs[0].lang}</span>`,
        escape: false,
        command: () => this.changeLang(this.appTranslate.langs[0])
      },
      {
        label: `<img src="${this.appTranslate.langs[1].flag}" alt="LG" width="30" height="20" class="img-flag"> <span class="p-ml-1">${this.appTranslate.langs[1].lang}</span>`,
        escape: false,
        command: () => this.changeLang(this.appTranslate.langs[1])
      }
    ];
  }

  onMenuButtonClick(event: Event) {
    this.toggleMenu.emit();
    event.preventDefault();
  }

  changeLang(lang: ILanguage): void {
    this.currentLang = lang;
    this.appTranslate.changeLanguage(lang.key, true);
  }
}
