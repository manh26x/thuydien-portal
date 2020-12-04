import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ILanguage } from '../model/language';
import { Language } from '../model/language.enum';

@Injectable({providedIn: 'root'})
export class AppTranslateService {
  readonly langs: ILanguage[] = [
    { key: Language.VIET_NAM, lang: 'VN', flag: 'vn' },
    { key: Language.ENGLISH, lang: 'EN', flag: 'en' }
  ];
  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(private translate: TranslateService) {
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

  changeLanguage(language: string): string {

    if (!language) {
      language = this.translate.defaultLang;
    }

    if (language !== this.translate.currentLang) {
      localStorage.setItem(Language.LOCAL_KEY, language);
      this.translate.use(language);
      this.onLanguageChanged.next(language);
    }

    return language;
  }
}
