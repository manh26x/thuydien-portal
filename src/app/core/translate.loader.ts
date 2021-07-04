import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../environments/environment';
import { InjectionToken } from '@angular/core';

/**
 * @author TruongNH
 * date: 01/12/2020
 * desc: translate loader
 */
export function CustomTranslateLoader(languageConfig: ILanguageConfig, http: HttpClient): TranslateHttpLoader {
  if (environment.production) {
    return new TranslateHttpLoader(http, languageConfig.path, '.json?v=' + environment.version);
  } else {
    return new TranslateHttpLoader(http, languageConfig.path, '.json');
  }
}

export const LANGUAGE_FILE_PATH = new InjectionToken<ILanguageConfig>('language.config');

export interface ILanguageConfig {
  path: string;
}
