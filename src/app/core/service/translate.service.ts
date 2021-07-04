import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import { ILanguage } from '../model/language';
import { Language } from '../model/language.enum';
import {Router} from '@angular/router';

@Injectable()
export class AppTranslateService {
  readonly langs: ILanguage[] = [
    { key: Language.VIET_NAM, lang: 'VN', flag: './assets/images/flag/vn.png' },
    { key: Language.ENGLISH, lang: 'EN', flag: './assets/images/flag/en.png' }
  ];
  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(private translate: TranslateService, private router: Router) {
  }

  initialize(): ILanguage {
    const currentLang = localStorage.getItem(Language.LOCAL_KEY);
    let lang = this.langs.find(l => l.key === currentLang);
    if (lang) {
      this.changeLanguage(lang.key);
    } else {
      lang = this.langs[0];
      this.translate.use(this.langs[0].key);
      localStorage.setItem(Language.LOCAL_KEY, this.langs[0].key);
    }
    return lang;
  }

  changeLanguage(language: string, reload?: boolean): string {

    if (!language) {
      language = this.translate.defaultLang;
    }

    if (language !== this.translate.currentLang) {
      localStorage.setItem(Language.LOCAL_KEY, language);
      this.translate.use(language);
      if (reload) {
        this.router.navigate([this.router.routerState.snapshot.url]);
      }
      this.onLanguageChanged.next(language);
    }

    return language;
  }

  getTranslationAsync(key: string, interpolateParams?: any): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }

  getTranslate(key: string): any {
    return this.translate.instant(key);
  }
}
