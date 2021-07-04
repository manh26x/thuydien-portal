import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';
import { Language } from './model/language.enum';

export class BaseModule {
  constructor(private translateService: TranslateService, router: Router) {
    this.setTranslateLanguage();
    router.events.subscribe(events => {
      if (events instanceof NavigationStart) {
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
    const currentLang = localStorage.getItem(Language.LOCAL_KEY);
    return currentLang && currentLang !== '' ? currentLang : Language.DEFAULT;
  }
}
