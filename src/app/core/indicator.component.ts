import {BaseComponent} from './base.component';

export abstract class IndicatorComponent extends BaseComponent {
  isLoading = false;
  isLoadFailed = false;
  constructor() {
    super();
  }

  /**
   * @description Toggles loading
   */
  toggleActivityIndicatorLoading(loading: boolean) {
    this.isLoadFailed = false;
    this.isLoading = loading;
  }

  /**
   * @description Toggles failed
   */
  toggleActivityIndicatorFailed(failed: boolean) {
    if (failed) { this.isLoading = true; }
    this.isLoadFailed = failed;
  }

  /**
   * @description Set status ActivityIndicator to loading.
   */
  resetActivityIndicator() {
    this.isLoading = true;
    this.isLoadFailed = false;
  }

  /**
   * @description Try to reload if failed
   */
  tryAgain() { }
}
