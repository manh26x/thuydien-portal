import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class CustomMissingTranslationHandler extends MissingTranslationHandler {
  constructor() {
    super();
  }

  handle(params: MissingTranslationHandlerParams): any {
    console.error('not found translate key: ' + params.key);
    return params.key;
  }
}
