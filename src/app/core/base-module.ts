import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Language } from './model/language.enum';

export class BaseModule {
  private readonly CURRENT_LANG = 'lang';
  constructor(private translateService: TranslateService, router: Router) {
    this.setTranslateLanguage();
    router.events.subscribe(events => {
      if (events instanceof NavigationStart || events instanceof NavigationEnd) {
        this.translateService.use(this.getLanguage());
      }
    });
    translateService.onLangChange.subscribe(res => {
      this.translateService.currentLang = res.lang;
    });
  }

  private setTranslateLanguage() {
    this.translateService.use(this.getLanguage());
  }

  public getLanguage(): string {
    const currentLang = localStorage.getItem(this.CURRENT_LANG);
    return currentLang && currentLang !== '' ? currentLang : Language.DEFAULT;
  }
}
