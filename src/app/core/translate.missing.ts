import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

/**
 * @author TruongNH
 * date: 01/12/2020
 * desc: missing translate handle
 */
export class CustomMissingTranslationHandler extends MissingTranslationHandler {
  constructor() {
    super();
  }

  handle(params: MissingTranslationHandlerParams): any {
    console.error('not found translate key: ' + params.key);
    return params.key;
  }
}
